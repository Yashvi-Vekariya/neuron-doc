'use client';
import { useState } from 'react';
import { ChevronDown, ChevronRight, HelpCircle } from 'lucide-react';

const faqs = [
  { q: 'What file types are supported?', a: 'Only PDF files, maximum 50MB per file.' },
  { q: 'How does the RAG system work?', a: 'Your PDF is split into chunks, embedded into vectors, and stored. When you ask a question, the system finds the most relevant chunks using hybrid search and passes them to Groq LLM to generate a grounded answer.' },
  { q: 'Is my data secure?', a: 'Yes. All documents are stored in Supabase with row-level security. Only you can access your documents.' },
  { q: 'How accurate are the answers?', a: 'Answers are grounded in your document with confidence scores shown. Always verify critical information from the original document.' },
  { q: 'How do I delete a document?', a: 'Hover over any document in Dashboard or Documents page and click the trash icon.' },
  { q: 'What is the confidence score?', a: '80%+ is good, 60-80% is moderate. If too low, try rephrasing your question.' },
  { q: 'Why is the AI unable to find information?', a: 'The document may be a scanned image PDF without text, or the information may not be in the document. Try rephrasing your question.' },
];

export default function HelpPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <HelpCircle className="w-5 h-5 text-[#00ff41]" />
        <h1 className="font-['Share_Tech_Mono'] text-2xl">HELP_CENTER</h1>
      </div>

      <div className="border border-[#00ff41]/20 p-6 mb-6">
        <p className="text-xs text-[#1a5c26] font-mono mb-5">// QUICK_START_GUIDE</p>
        <div className="space-y-5">
          {[
            { num: '01', title: 'Upload a PDF', desc: 'Go to Upload page and drag & drop your PDF file (max 50MB).' },
            { num: '02', title: 'Wait for processing', desc: 'System automatically extracts text and creates vector embeddings.' },
            { num: '03', title: 'Start chatting', desc: 'Click your document and ask any question in natural language.' },
            { num: '04', title: 'Review sources', desc: 'Each response includes confidence score and expandable source citations.' },
          ].map(({ num, title, desc }) => (
            <div key={num} className="flex gap-4">
              <span className="font-['Share_Tech_Mono'] text-[#00ff41] text-xl shrink-0 w-8">{num}</span>
              <div>
                <p className="font-mono text-sm mb-1">{title}</p>
                <p className="text-xs text-[#1a5c26] font-mono leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-[#00ff41]/20 mb-6">
        <div className="p-4 border-b border-[#00ff41]/20">
          <p className="text-xs text-[#1a5c26] font-mono">// FAQ</p>
        </div>
        {faqs.map((faq, i) => (
          <div key={i} className="border-b border-[#00ff41]/10 last:border-0">
            <button className="w-full flex items-center justify-between p-4 hover:bg-[#00ff41]/3 transition-colors text-left"
              onClick={() => setOpen(open === i ? null : i)}>
              <span className="font-mono text-sm pr-4">{faq.q}</span>
              {open === i ? <ChevronDown className="w-4 h-4 text-[#00ff41] shrink-0" /> : <ChevronRight className="w-4 h-4 text-[#1a5c26] shrink-0" />}
            </button>
            {open === i && (
              <div className="px-4 pb-4 border-t border-[#00ff41]/10">
                <p className="text-xs text-[#1a5c26] font-mono leading-relaxed pt-3">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border border-[#00ff41]/20 p-6 mb-6">
        <p className="text-xs text-[#1a5c26] font-mono mb-4">// RAG_PIPELINE</p>
        <div className="space-y-2">
          {[
            ['rewrite_query()', 'Rewrites your question for better search'],
            ['create_embedding()', 'Converts question to vector embedding'],
            ['hybrid_search()', 'Searches with vector + keyword matching'],
            ['build_context()', 'Selects most relevant document chunks'],
            ['generate_response()', 'Generates answer using Groq LLM'],
          ].map(([step, desc]) => (
            <div key={step} className="flex items-start gap-3">
              <span className="font-mono text-xs text-[#00ff41] shrink-0">{step}</span>
              <span className="text-xs text-[#1a5c26] font-mono">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

