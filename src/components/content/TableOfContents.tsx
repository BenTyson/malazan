'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { List } from 'lucide-react';

interface TocEntry {
  title: string;
  url: string;
  items?: TocEntry[];
}

interface TableOfContentsProps {
  toc: TocEntry[];
}

export function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0% -80% 0%' }
    );

    const headings = document.querySelectorAll('article h2, article h3');
    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, []);

  // Flatten nested toc structure
  const flattenToc = (entries: TocEntry[], depth = 2): { title: string; url: string; depth: number }[] => {
    return entries.flatMap(entry => [
      { title: entry.title, url: entry.url, depth },
      ...(entry.items ? flattenToc(entry.items, depth + 1) : []),
    ]);
  };

  const flatToc = flattenToc(toc);

  if (flatToc.length === 0) return null;

  // Calculate active index for progress bar
  const activeIndex = flatToc.findIndex(item => item.url.slice(1) === activeId);
  const progressPercent = activeIndex >= 0 ? ((activeIndex + 1) / flatToc.length) * 100 : 0;

  return (
    <nav className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 sticky top-24 shadow-xl shadow-black/10">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center">
          <List className="w-4 h-4 text-primary" />
        </div>
        <h4 className="font-semibold text-sm text-slate-300">
          On This Page
        </h4>
      </div>

      {/* Progress indicator */}
      <div className="relative">
        {/* Background track */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-700/50 rounded-full" />
        {/* Active progress */}
        <div
          className="absolute left-0 top-0 w-0.5 bg-gradient-to-b from-primary to-cyan-500 rounded-full transition-all duration-300"
          style={{ height: `${progressPercent}%` }}
        />

        <ul className="space-y-1 text-sm pl-4">
          {flatToc.map((item, index) => {
            const isActive = activeId === item.url.slice(1);
            const isPast = activeIndex >= 0 && index < activeIndex;

            return (
              <li key={item.url} className="relative">
                {/* Active indicator dot */}
                <div
                  className={cn(
                    'absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300',
                    isActive
                      ? 'bg-primary shadow-lg shadow-primary/50 scale-125'
                      : isPast
                      ? 'bg-primary/50'
                      : 'bg-slate-600'
                  )}
                />
                <a
                  href={item.url}
                  className={cn(
                    'block py-1.5 pl-2 rounded-lg transition-all duration-200 hover:text-primary hover:bg-slate-700/30',
                    item.depth > 2 && 'pl-5 text-xs',
                    isActive
                      ? 'text-primary font-medium bg-primary/10'
                      : 'text-slate-400'
                  )}
                >
                  {item.title}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
