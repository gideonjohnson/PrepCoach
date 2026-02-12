import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET /api/stage-progress?category=Product%20Design
// Get stage progress for a specific category
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    // Get or create stage progress for all 3 stages
    const stages = await Promise.all([1, 2, 3].map(async (stageNum) => {
      let progress = await prisma.stageProgress.findUnique({
        where: {
          userId_roleCategory_stage: {
            userId: session.user.id,
            roleCategory: category,
            stage: stageNum,
          },
        },
      });

      // If doesn't exist, create it
      if (!progress) {
        progress = await prisma.stageProgress.create({
          data: {
            userId: session.user.id,
            roleCategory: category,
            stage: stageNum,
            isUnlocked: stageNum === 1, // Stage 1 is always unlocked
          },
        });
      }

      return progress;
    }));

    // Auto-unlock stages based on previous stage completion
    for (let i = 1; i < stages.length; i++) {
      const previousStage = stages[i - 1];
      const currentStage = stages[i];

      // Unlock if previous stage is 80% complete
      if (previousStage.completionPercentage >= 80 && !currentStage.isUnlocked) {
        await prisma.stageProgress.update({
          where: { id: currentStage.id },
          data: { isUnlocked: true },
        });
        currentStage.isUnlocked = true;
      }
    }

    return NextResponse.json({ stages }, { status: 200 });
  } catch (error) {
    console.error('Error fetching stage progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stage progress' },
      { status: 500 }
    );
  }
}

// POST /api/stage-progress
// Update stage progress (after completing questions)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { category, stage, completedQuestions } = await request.json();

    if (!category || !stage || completedQuestions === undefined) {
      return NextResponse.json(
        { error: 'Category, stage, and completedQuestions are required' },
        { status: 400 }
      );
    }

    const completionPercentage = Math.round((completedQuestions / 15) * 100);
    const isCompleted = completionPercentage >= 80;

    // Update or create stage progress
    const progress = await prisma.stageProgress.upsert({
      where: {
        userId_roleCategory_stage: {
          userId: session.user.id,
          roleCategory: category,
          stage,
        },
      },
      update: {
        completedQuestions,
        completionPercentage,
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
      create: {
        userId: session.user.id,
        roleCategory: category,
        stage,
        completedQuestions,
        completionPercentage,
        isCompleted,
        isUnlocked: stage === 1,
        completedAt: isCompleted ? new Date() : null,
      },
    });

    // If this stage is completed (80%+), unlock the next stage
    if (isCompleted && stage < 3) {
      await prisma.stageProgress.upsert({
        where: {
          userId_roleCategory_stage: {
            userId: session.user.id,
            roleCategory: category,
            stage: stage + 1,
          },
        },
        update: {
          isUnlocked: true,
        },
        create: {
          userId: session.user.id,
          roleCategory: category,
          stage: stage + 1,
          isUnlocked: true,
        },
      });
    }

    return NextResponse.json({ progress }, { status: 200 });
  } catch (error) {
    console.error('Error updating stage progress:', error);
    return NextResponse.json(
      { error: 'Failed to update stage progress' },
      { status: 500 }
    );
  }
}
