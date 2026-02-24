'use client';
import { useParams } from 'next/navigation';
import { ChatInterface } from '@/components/chat/ChatInterface';

export default function ChatPage() {
  const params = useParams();
  const docId = params?.docId as string;
  return (
    <div className="h-screen">
      <ChatInterface docId={docId} />
    </div>
  );
}

