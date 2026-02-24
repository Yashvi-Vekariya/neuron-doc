export const API_URL = 'http://localhost:8000';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  DOCUMENTS: '/dashboard/documents',
  UPLOAD: '/dashboard/upload',
  ANALYTICS: '/dashboard/analytics',
  SETTINGS: '/dashboard/settings',
  HELP: '/dashboard/help',
  CHAT: (docId: string) => `/dashboard/chat/${docId}`,
} as const;

export const AGENT_STEPS = [
  'rewrite_query()',
  'create_embedding()',
  'hybrid_search()',
  'build_context()',
  'generate_response()',
] as const;

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
