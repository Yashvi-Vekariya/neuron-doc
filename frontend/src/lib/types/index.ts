export interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
}

export interface Document {
  id?: string;
  doc_id: string;
  filename: string;
  file_size: number;
  chunks: number;
  status: 'processing' | 'completed' | 'failed';
  created_at: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  confidence?: number;
  sources?: Source[];
  created_at?: string;
}

export interface Source {
  text: string;
  page: number;
  doc_id: string;
}

export interface ChatResponse {
  answer: string;
  confidence: number;
  sources: Source[];
}
