// System Design Diagram Templates for Excalidraw
// Each template contains pre-built architecture patterns

export interface DiagramTemplate {
  id: string;
  name: string;
  description: string;
  category: 'web' | 'distributed' | 'data' | 'messaging' | 'storage';
  elements: unknown[];
  appState?: Record<string, unknown>;
}

// Helper to create rectangle elements
const createRect = (id: string, x: number, y: number, width: number, height: number, text: string, color: string = '#ffffff') => ({
  id,
  type: 'rectangle',
  x,
  y,
  width,
  height,
  strokeColor: '#1e1e1e',
  backgroundColor: color,
  fillStyle: 'solid',
  strokeWidth: 2,
  roughness: 0,
  opacity: 100,
  groupIds: [],
  roundness: { type: 3 },
  boundElements: [{ id: `${id}-text`, type: 'text' }],
  isDeleted: false,
  locked: false,
});

// Helper to create text elements
const createText = (id: string, x: number, y: number, text: string, fontSize: number = 16) => ({
  id,
  type: 'text',
  x,
  y,
  width: text.length * fontSize * 0.6,
  height: fontSize * 1.5,
  text,
  fontSize,
  fontFamily: 1,
  textAlign: 'center',
  verticalAlign: 'middle',
  strokeColor: '#1e1e1e',
  backgroundColor: 'transparent',
  fillStyle: 'solid',
  strokeWidth: 1,
  roughness: 0,
  opacity: 100,
  groupIds: [],
  isDeleted: false,
  locked: false,
});

// Helper to create arrow elements
const createArrow = (id: string, x1: number, y1: number, x2: number, y2: number) => ({
  id,
  type: 'arrow',
  x: x1,
  y: y1,
  width: x2 - x1,
  height: y2 - y1,
  points: [[0, 0], [x2 - x1, y2 - y1]],
  strokeColor: '#1e1e1e',
  backgroundColor: 'transparent',
  fillStyle: 'solid',
  strokeWidth: 2,
  roughness: 0,
  opacity: 100,
  groupIds: [],
  roundness: { type: 2 },
  startArrowhead: null,
  endArrowhead: 'arrow',
  isDeleted: false,
  locked: false,
});

// Helper to create ellipse (for databases, etc.)
const createEllipse = (id: string, x: number, y: number, width: number, height: number, text: string, color: string = '#e8f4fd') => ({
  id,
  type: 'ellipse',
  x,
  y,
  width,
  height,
  strokeColor: '#1e1e1e',
  backgroundColor: color,
  fillStyle: 'solid',
  strokeWidth: 2,
  roughness: 0,
  opacity: 100,
  groupIds: [],
  boundElements: [{ id: `${id}-text`, type: 'text' }],
  isDeleted: false,
  locked: false,
});

export const systemDesignTemplates: DiagramTemplate[] = [
  {
    id: 'load-balancer',
    name: 'Load Balancer Pattern',
    description: 'Basic load balancer with multiple servers',
    category: 'web',
    elements: [
      // Client
      createRect('client', 50, 150, 120, 60, 'Client', '#fef3c7'),
      createText('client-text', 80, 170, 'Client', 16),

      // Load Balancer
      createRect('lb', 250, 150, 140, 60, 'Load Balancer', '#dbeafe'),
      createText('lb-text', 270, 170, 'Load Balancer', 14),

      // Servers
      createRect('server1', 470, 50, 120, 60, 'Server 1', '#dcfce7'),
      createText('server1-text', 495, 70, 'Server 1', 14),
      createRect('server2', 470, 150, 120, 60, 'Server 2', '#dcfce7'),
      createText('server2-text', 495, 170, 'Server 2', 14),
      createRect('server3', 470, 250, 120, 60, 'Server 3', '#dcfce7'),
      createText('server3-text', 495, 270, 'Server 3', 14),

      // Arrows
      createArrow('arrow1', 170, 180, 250, 180),
      createArrow('arrow2', 390, 160, 470, 80),
      createArrow('arrow3', 390, 180, 470, 180),
      createArrow('arrow4', 390, 200, 470, 280),
    ],
  },
  {
    id: 'microservices',
    name: 'Microservices Architecture',
    description: 'API Gateway with multiple microservices',
    category: 'distributed',
    elements: [
      // Client
      createRect('client', 50, 200, 100, 60, 'Client', '#fef3c7'),
      createText('client-text', 70, 220, 'Client', 14),

      // API Gateway
      createRect('gateway', 220, 200, 120, 60, 'API Gateway', '#e0e7ff'),
      createText('gateway-text', 235, 220, 'API Gateway', 12),

      // Services
      createRect('auth', 420, 50, 120, 50, 'Auth Service', '#fce7f3'),
      createText('auth-text', 440, 65, 'Auth Service', 12),
      createRect('user', 420, 130, 120, 50, 'User Service', '#dcfce7'),
      createText('user-text', 440, 145, 'User Service', 12),
      createRect('order', 420, 210, 120, 50, 'Order Service', '#dbeafe'),
      createText('order-text', 435, 225, 'Order Service', 12),
      createRect('payment', 420, 290, 140, 50, 'Payment Service', '#fef9c3'),
      createText('payment-text', 430, 305, 'Payment Service', 12),
      createRect('notify', 420, 370, 140, 50, 'Notification', '#e0e7ff'),
      createText('notify-text', 445, 385, 'Notification', 12),

      // Databases
      createEllipse('db1', 620, 115, 80, 50, 'User DB', '#e8f4fd'),
      createText('db1-text', 635, 130, 'User DB', 11),
      createEllipse('db2', 620, 195, 80, 50, 'Order DB', '#e8f4fd'),
      createText('db2-text', 632, 210, 'Order DB', 11),

      // Arrows
      createArrow('a1', 150, 230, 220, 230),
      createArrow('a2', 340, 210, 420, 75),
      createArrow('a3', 340, 220, 420, 155),
      createArrow('a4', 340, 230, 420, 235),
      createArrow('a5', 340, 240, 420, 315),
      createArrow('a6', 340, 250, 420, 395),
      createArrow('a7', 540, 155, 620, 140),
      createArrow('a8', 540, 235, 620, 220),
    ],
  },
  {
    id: 'cache-aside',
    name: 'Cache-Aside Pattern',
    description: 'Application with Redis cache and database',
    category: 'data',
    elements: [
      // Application
      createRect('app', 50, 150, 120, 70, 'Application', '#dbeafe'),
      createText('app-text', 70, 175, 'Application', 13),

      // Cache
      createRect('cache', 280, 80, 120, 60, 'Redis Cache', '#fecaca'),
      createText('cache-text', 295, 100, 'Redis Cache', 12),

      // Database
      createEllipse('db', 280, 200, 120, 70, 'Database', '#e8f4fd'),
      createText('db-text', 305, 225, 'Database', 14),

      // Arrows with labels
      createArrow('a1', 170, 160, 280, 110),
      createText('a1-label', 200, 115, '1. Check cache', 10),
      createArrow('a2', 170, 200, 280, 230),
      createText('a2-label', 195, 230, '2. Cache miss → DB', 10),
      createArrow('a3', 340, 200, 400, 110),
      createText('a3-label', 370, 140, '3. Update cache', 10),
    ],
  },
  {
    id: 'event-driven',
    name: 'Event-Driven Architecture',
    description: 'Message queue with producers and consumers',
    category: 'messaging',
    elements: [
      // Producers
      createRect('prod1', 50, 80, 110, 50, 'Producer 1', '#dcfce7'),
      createText('prod1-text', 70, 95, 'Producer 1', 12),
      createRect('prod2', 50, 150, 110, 50, 'Producer 2', '#dcfce7'),
      createText('prod2-text', 70, 165, 'Producer 2', 12),
      createRect('prod3', 50, 220, 110, 50, 'Producer 3', '#dcfce7'),
      createText('prod3-text', 70, 235, 'Producer 3', 12),

      // Message Queue
      createRect('queue', 240, 120, 140, 80, 'Message Queue\n(Kafka/RabbitMQ)', '#fef3c7'),
      createText('queue-text', 255, 145, 'Message Queue', 12),
      createText('queue-sub', 260, 170, '(Kafka/RabbitMQ)', 10),

      // Consumers
      createRect('cons1', 460, 80, 110, 50, 'Consumer 1', '#dbeafe'),
      createText('cons1-text', 475, 95, 'Consumer 1', 12),
      createRect('cons2', 460, 150, 110, 50, 'Consumer 2', '#dbeafe'),
      createText('cons2-text', 475, 165, 'Consumer 2', 12),
      createRect('cons3', 460, 220, 110, 50, 'Consumer 3', '#dbeafe'),
      createText('cons3-text', 475, 235, 'Consumer 3', 12),

      // Arrows
      createArrow('p1', 160, 105, 240, 140),
      createArrow('p2', 160, 175, 240, 160),
      createArrow('p3', 160, 245, 240, 180),
      createArrow('c1', 380, 140, 460, 105),
      createArrow('c2', 380, 160, 460, 175),
      createArrow('c3', 380, 180, 460, 245),
    ],
  },
  {
    id: 'cdn-static',
    name: 'CDN + Static Assets',
    description: 'Content delivery with origin server',
    category: 'web',
    elements: [
      // Users
      createRect('user1', 30, 50, 80, 40, 'User 1', '#fef3c7'),
      createText('user1-text', 45, 60, 'User 1', 11),
      createRect('user2', 30, 120, 80, 40, 'User 2', '#fef3c7'),
      createText('user2-text', 45, 130, 'User 2', 11),
      createRect('user3', 30, 190, 80, 40, 'User 3', '#fef3c7'),
      createText('user3-text', 45, 200, 'User 3', 11),

      // CDN Edge Nodes
      createRect('edge1', 180, 50, 100, 40, 'CDN Edge', '#e0e7ff'),
      createText('edge1-text', 195, 60, 'CDN Edge', 11),
      createRect('edge2', 180, 120, 100, 40, 'CDN Edge', '#e0e7ff'),
      createText('edge2-text', 195, 130, 'CDN Edge', 11),
      createRect('edge3', 180, 190, 100, 40, 'CDN Edge', '#e0e7ff'),
      createText('edge3-text', 195, 200, 'CDN Edge', 11),

      // Origin Server
      createRect('origin', 380, 100, 120, 60, 'Origin Server', '#dcfce7'),
      createText('origin-text', 395, 120, 'Origin Server', 12),

      // Object Storage
      createEllipse('s3', 380, 200, 120, 50, 'S3 / Blob', '#e8f4fd'),
      createText('s3-text', 405, 215, 'S3 / Blob', 12),

      // Arrows
      createArrow('u1', 110, 70, 180, 70),
      createArrow('u2', 110, 140, 180, 140),
      createArrow('u3', 110, 210, 180, 210),
      createArrow('e1', 280, 100, 380, 120),
      createArrow('e2', 280, 160, 380, 140),
      createArrow('o1', 440, 160, 440, 200),
    ],
  },
  {
    id: 'database-sharding',
    name: 'Database Sharding',
    description: 'Horizontal partitioning with shard router',
    category: 'storage',
    elements: [
      // Application
      createRect('app', 50, 150, 120, 60, 'Application', '#dbeafe'),
      createText('app-text', 70, 170, 'Application', 13),

      // Shard Router
      createRect('router', 250, 150, 130, 60, 'Shard Router', '#fef3c7'),
      createText('router-text', 265, 170, 'Shard Router', 12),

      // Shards
      createEllipse('shard1', 460, 50, 110, 50, 'Shard 1\n(A-H)', '#dcfce7'),
      createText('shard1-text', 480, 60, 'Shard 1', 11),
      createText('shard1-sub', 485, 80, '(A-H)', 10),
      createEllipse('shard2', 460, 130, 110, 50, 'Shard 2\n(I-P)', '#dcfce7'),
      createText('shard2-text', 480, 140, 'Shard 2', 11),
      createText('shard2-sub', 485, 160, '(I-P)', 10),
      createEllipse('shard3', 460, 210, 110, 50, 'Shard 3\n(Q-Z)', '#dcfce7'),
      createText('shard3-text', 480, 220, 'Shard 3', 11),
      createText('shard3-sub', 485, 240, '(Q-Z)', 10),

      // Arrows
      createArrow('a1', 170, 180, 250, 180),
      createArrow('a2', 380, 165, 460, 75),
      createArrow('a3', 380, 180, 460, 155),
      createArrow('a4', 380, 195, 460, 235),
    ],
  },
  {
    id: 'cqrs',
    name: 'CQRS Pattern',
    description: 'Command Query Responsibility Segregation',
    category: 'distributed',
    elements: [
      // Client
      createRect('client', 50, 150, 100, 60, 'Client', '#fef3c7'),
      createText('client-text', 70, 170, 'Client', 13),

      // Command Side
      createRect('cmd', 220, 80, 120, 50, 'Command\nHandler', '#fecaca'),
      createText('cmd-text', 245, 95, 'Command', 11),
      createRect('writedb', 400, 80, 100, 50, 'Write DB', '#dcfce7'),
      createText('writedb-text', 415, 95, 'Write DB', 11),

      // Event Bus
      createRect('bus', 400, 160, 100, 40, 'Event Bus', '#e0e7ff'),
      createText('bus-text', 415, 170, 'Event Bus', 11),

      // Query Side
      createRect('query', 220, 220, 120, 50, 'Query\nHandler', '#dbeafe'),
      createText('query-text', 250, 235, 'Query', 11),
      createRect('readdb', 400, 220, 100, 50, 'Read DB', '#dcfce7'),
      createText('readdb-text', 420, 235, 'Read DB', 11),

      // Arrows
      createArrow('c1', 150, 160, 220, 105),
      createArrow('c2', 150, 200, 220, 245),
      createArrow('w1', 340, 105, 400, 105),
      createArrow('e1', 450, 130, 450, 160),
      createArrow('e2', 450, 200, 450, 220),
      createArrow('r1', 400, 245, 340, 245),
    ],
  },
  {
    id: 'three-tier',
    name: 'Three-Tier Architecture',
    description: 'Classic presentation, logic, and data layers',
    category: 'web',
    elements: [
      // Presentation Tier
      createRect('web', 250, 30, 140, 50, 'Web Server\n(Nginx)', '#dbeafe'),
      createText('web-text', 275, 45, 'Web Server', 12),

      // Application Tier
      createRect('app1', 150, 130, 100, 50, 'App Server', '#dcfce7'),
      createText('app1-text', 165, 145, 'App Server', 11),
      createRect('app2', 270, 130, 100, 50, 'App Server', '#dcfce7'),
      createText('app2-text', 285, 145, 'App Server', 11),
      createRect('app3', 390, 130, 100, 50, 'App Server', '#dcfce7'),
      createText('app3-text', 405, 145, 'App Server', 11),

      // Data Tier
      createEllipse('primary', 200, 240, 100, 50, 'Primary DB', '#fef3c7'),
      createText('primary-text', 215, 255, 'Primary DB', 11),
      createEllipse('replica', 350, 240, 100, 50, 'Replica DB', '#fef3c7'),
      createText('replica-text', 365, 255, 'Replica DB', 11),

      // Arrows
      createArrow('a1', 290, 80, 200, 130),
      createArrow('a2', 320, 80, 320, 130),
      createArrow('a3', 350, 80, 440, 130),
      createArrow('a4', 200, 180, 250, 240),
      createArrow('a5', 320, 180, 320, 240),
      createArrow('a6', 440, 180, 400, 240),
      createArrow('rep', 300, 265, 350, 265),
    ],
  },
];

export function getTemplatesByCategory(category: string): DiagramTemplate[] {
  return systemDesignTemplates.filter(t => t.category === category);
}

export function getTemplateById(id: string): DiagramTemplate | undefined {
  return systemDesignTemplates.find(t => t.id === id);
}
