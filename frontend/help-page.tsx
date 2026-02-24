'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, HelpCircle, MessageSquare, FileText, Zap } from 'lucide-react';

const faqs = [
  {
    q: 'What file types are supported?',
    a: 'Currently only PDF files are supported. Maximum file size is 50MB.',
  },
  {
    q: 'How does the RAG system work?',
    a: 'Your document is split into chunks, converted to vector embeddings, and stored in a vector database. When you ask a question, we perform hybrid search (vector + keyword) to find relevant chunks, then use Groq LLM to generate an accurate answer.',
  },
  {
    q: 'How many pages can be processed?',
    a: 'Currently up to 10 pages per document are processed for optimal performance.',
  },
  {
    q: 'Are my documents secure?',
    a: 'Yes. Documents are stored securely in Supabase with row-level security. Only you can access your documents.',
  },
  {
    q: 'Why is the answer inaccurate?',
    a: 'The AI answers based only on the document content. If the information is not in the document, it will say so. Try rephrasing your question for better results.',
  },
  {
    q: 'Can I delete my documents?',
    a: 'Yes. Click the X button on any document in the dashboard or documents page to delete it permanently.',
  },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <HelpCircle className="w-6 h-6 text-[#00ff41]" />
          <h1 className="font-['Share_Tech_Mono'] text-2xl">HELP_CENTER</h1>
        </div>
        <p className="text-[#1a5c26] text-sm">Documentation and frequently asked questions</p>
      </div>

      {/* Quick Start */}
      <div className="border border-[#00ff41]/30 p-6 mb-8">
        <h2 className="font-mono text-sm text-[#1a5c26] mb-4">// QUICK_START_GUIDE</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { step: '01', icon: FileText, title: 'UPLOAD_PDF', desc: 'Drag & drop or click to upload your PDF document' },
            { step: '02', icon: Zap, title: 'AUTO_PROCESS', desc: 'System automatically extracts text and creates embeddings' },
            { step: '03', icon: MessageSquare, title: 'START_CHATTING', desc: 'Ask questions and get AI-powered answers with sources' },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="border border-[#00ff41]/20 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-[#1a5c26]">{item.step}</span>
                  <Icon className="w-4 h-4 text-[#00ff41]" />
                  <span className="font-mono text-sm">{item.title}</span>
                </div>
                <p className="text-xs text-[#1a5c26]">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQs */}
      <div className="border border-[#00ff41]/30">
        <div className="p-4 border-b border-[#00ff41]/30">
          <h2 className="font-mono text-sm text-[#1a5c26]">// FREQUENTLY_ASKED_QUESTIONS</h2>
        </div>
        <div className="divide-y divide-[#00ff41]/20">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#00ff41]/5 transition-colors"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="font-mono text-sm">{faq.q}</span>
                {openFaq === i
                  ? <ChevronDown className="w-4 h-4 text-[#00ff41] shrink-0" />
                  : <ChevronRight className="w-4 h-4 text-[#1a5c26] shrink-0" />
                }
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-[#1a5c26] border-l-2 border-[#00ff41]/50 pl-3">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="mt-8 border border-[#00ff41]/30 p-6 text-center">
        <p className="font-mono text-sm mb-2">Still need help?</p>
        <p className="text-xs text-[#1a5c26]">Contact support or check the documentation</p>
      </div>
    </div>
  );
}
