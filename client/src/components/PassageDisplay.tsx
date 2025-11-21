import type { PassageElement } from '../types/bible';
import { Loader2, AlertCircle } from 'lucide-react';

interface PassageDisplayProps {
  reference: string;
  elements: PassageElement[];
  loading?: boolean;
  error?: string | null;
}

export function PassageDisplay({ reference, elements, loading, error }: PassageDisplayProps) {
  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading passage...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm">Error: {error}</span>
        </div>
      </div>
    );
  }

  if (elements.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-zinc-500 text-sm">No verses to display</div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-8 sm:p-12 min-h-[85vh]">
        <h1 className="text-3xl font-semibold mb-8 text-zinc-900">
          {reference}
        </h1>

        <div className="text-zinc-800 leading-relaxed">
          {elements.map((element, index) => {
            if (element.type === 'heading') {
              return (
                <h2
                  key={`heading-${index}`}
                  className="text-xl font-semibold mt-10 mb-5 text-zinc-900 first:mt-0"
                >
                  {element.content}
                </h2>
              );
            }

            if (element.type === 'paragraph-break') {
              return <div key={`break-${index}`} className="h-4" />;
            }

            if (element.type === 'verse' && element.verse) {
              return (
                <span key={`verse-${element.verse.number}`} className="text-[16px] leading-[1.8]">
                  <sup className="text-zinc-400 text-[11px] font-medium mr-1.5">
                    {element.verse.number}
                  </sup>
                  {element.verse.text}{' '}
                </span>
              );
            }

            return null;
          })}
        </div>

        <div className="mt-16 pt-8 border-t border-zinc-200">
          <p className="text-xs text-zinc-500">
            Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®).
          </p>
        </div>
      </div>
    </div>
  );
}
