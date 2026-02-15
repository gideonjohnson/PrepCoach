import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { execFile } from 'child_process';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';

const executeSchema = z.object({
  code: z.string().min(1),
  language: z.enum(['javascript', 'typescript', 'python']),
  problemId: z.string().optional(),
  sessionId: z.string().optional(),
});

const TIMEOUT_MS = 10_000; // 10 seconds max
const MAX_OUTPUT_LENGTH = 10_000;

interface TestResult {
  index: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  error?: string;
  executionTimeMs: number;
}

async function runCode(
  code: string,
  language: string,
  input: string
): Promise<{ stdout: string; stderr: string; executionTimeMs: number }> {
  const id = randomUUID();
  const tmpDir = join(tmpdir(), 'prepcoach-exec');
  await mkdir(tmpDir, { recursive: true });

  let filePath: string;
  let command: string;
  let args: string[];

  // Wrap code to read input from stdin-like arg and produce output
  const wrappedCode = wrapCode(code, language, input);

  if (language === 'javascript') {
    filePath = join(tmpDir, `${id}.js`);
    command = 'node';
    args = [filePath];
  } else if (language === 'typescript') {
    filePath = join(tmpDir, `${id}.ts`);
    command = 'npx';
    args = ['tsx', filePath];
  } else {
    // python
    filePath = join(tmpDir, `${id}.py`);
    command = 'python';
    args = [filePath];
  }

  await writeFile(filePath, wrappedCode, 'utf-8');

  const start = Date.now();

  return new Promise((resolve) => {
    const proc = execFile(
      command,
      args,
      {
        timeout: TIMEOUT_MS,
        maxBuffer: 1024 * 1024, // 1MB
        env: {
          ...process.env,
          NODE_OPTIONS: '--max-old-space-size=128',
        },
      },
      async (error, stdout, stderr) => {
        const executionTimeMs = Date.now() - start;

        // Clean up temp file
        try { await unlink(filePath); } catch { /* ignore */ }

        if (error) {
          const isTimeout = error.killed || (error as NodeJS.ErrnoException).code === 'ERR_CHILD_PROCESS_STDIO_FINAL';
          resolve({
            stdout: stdout?.substring(0, MAX_OUTPUT_LENGTH) || '',
            stderr: isTimeout
              ? 'Time Limit Exceeded (10s)'
              : (stderr || error.message).substring(0, MAX_OUTPUT_LENGTH),
            executionTimeMs,
          });
          return;
        }

        resolve({
          stdout: (stdout || '').substring(0, MAX_OUTPUT_LENGTH).trim(),
          stderr: (stderr || '').substring(0, MAX_OUTPUT_LENGTH),
          executionTimeMs,
        });
      }
    );

    // Kill if it exceeds timeout (belt and suspenders)
    setTimeout(() => {
      try { proc.kill('SIGKILL'); } catch { /* ignore */ }
    }, TIMEOUT_MS + 1000);
  });
}

function wrapCode(code: string, language: string, input: string): string {
  if (language === 'javascript' || language === 'typescript') {
    return `
${code}

// Auto-runner: parse input and call the main exported function
try {
  const __input = ${JSON.stringify(input)};
  const __parsed = JSON.parse(__input);

  // Find the first function defined in the code
  const __fnNames = Object.keys(__parsed);

  // Try to call the function with parsed args
  const __fns = {};
  try { ${language === 'typescript' ? '' : ''}
    // Collect all function declarations
    ${code.match(/function\s+(\w+)/g)?.map(m => {
      const name = m.replace('function ', '');
      return `if (typeof ${name} === 'function') __fns['${name}'] = ${name};`;
    }).join('\n    ') || '// No functions found'}
  } catch(e) {}

  const __fnList = Object.values(__fns);
  if (__fnList.length > 0) {
    const __fn = __fnList[0];
    const __args = Object.values(__parsed);
    const __result = __fn(...__args);
    console.log(JSON.stringify(__result));
  } else {
    console.log('ERROR: No function found in code');
  }
} catch(e) {
  console.error(e.message);
}
`;
  }

  // Python
  return `
import json, sys

${code}

if __name__ == '__main__':
    try:
        __input = json.loads(${JSON.stringify(input)})

        # Find first function defined
        __fn = None
        for name, obj in list(locals().items()):
            if callable(obj) and not name.startswith('_'):
                __fn = obj
                break

        if __fn:
            __args = list(__input.values())
            __result = __fn(*__args)
            print(json.dumps(__result))
        else:
            print('ERROR: No function found in code', file=sys.stderr)
    except Exception as e:
        print(str(e), file=sys.stderr)
`;
}

function normalizeOutput(output: string): string {
  return output.trim().replace(/\s+/g, '');
}

// POST /api/coding/execute - Execute code against test cases
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = executeSchema.parse(body);

    // Get test cases if problemId is provided
    let testCases: Array<{ input: string; expectedOutput: string; isHidden: boolean }> = [];

    if (validated.problemId) {
      const problem = await prisma.problem.findUnique({
        where: { id: validated.problemId },
        select: { testCases: true },
      });

      if (problem) {
        testCases = JSON.parse(problem.testCases);
      }
    }

    // If no test cases from problem, run code once with empty input
    if (testCases.length === 0) {
      const result = await runCode(validated.code, validated.language, '{}');
      return NextResponse.json({
        results: [],
        output: {
          stdout: result.stdout,
          stderr: result.stderr,
          executionTimeMs: result.executionTimeMs,
        },
      });
    }

    // Run code against each test case
    const results: TestResult[] = [];
    let totalTime = 0;

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const result = await runCode(validated.code, validated.language, tc.input);
      totalTime += result.executionTimeMs;

      const actualOutput = result.stdout.trim();
      const passed = result.stderr === '' &&
        normalizeOutput(actualOutput) === normalizeOutput(tc.expectedOutput);

      results.push({
        index: i,
        input: tc.isHidden ? '[Hidden]' : tc.input,
        expectedOutput: tc.isHidden ? '[Hidden]' : tc.expectedOutput,
        actualOutput: tc.isHidden && !passed ? '[Hidden]' : actualOutput,
        passed,
        error: result.stderr || undefined,
        executionTimeMs: result.executionTimeMs,
      });
    }

    const passedCount = results.filter((r) => r.passed).length;
    const totalCount = results.length;

    // Update session with test results if sessionId provided
    if (validated.sessionId) {
      try {
        await prisma.codingSession.update({
          where: { id: validated.sessionId },
          data: {
            testResults: JSON.stringify(results),
            lastTestRun: new Date(),
          },
        });
      } catch {
        // Session might not exist, ignore
      }
    }

    return NextResponse.json({
      results,
      summary: {
        passed: passedCount,
        total: totalCount,
        allPassed: passedCount === totalCount,
        totalExecutionTimeMs: totalTime,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error executing code:', error);
    return NextResponse.json(
      { error: 'Failed to execute code' },
      { status: 500 }
    );
  }
}
