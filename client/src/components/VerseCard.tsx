interface VerseCardProps {
  reference: string;
  content: string;
  onClick?: () => void;
}

export function VerseCard({ reference, content, onClick }: VerseCardProps) {
  return (
    <div
      className={`p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 transition-colors ${
        onClick ? 'hover:border-zinc-300 dark:hover:border-zinc-600 cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">
        {reference}
      </div>
      <div className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
        {content}
      </div>
    </div>
  );
}
