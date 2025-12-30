'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LEARN_CATEGORIES } from '@/lib/content/utils';
import { BookOpen, Cog, Lightbulb, Building2, CheckCircle2, Code2, GraduationCap, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LearnArticle {
  title: string;
  slug: string;
  category: string;
  order: number;
}

interface LearnSidebarProps {
  articles: LearnArticle[];
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'qr-basics': <BookOpen className="w-4 h-4" />,
  'how-it-works': <Cog className="w-4 h-4" />,
  'use-cases': <Lightbulb className="w-4 h-4" />,
  'industries': <Building2 className="w-4 h-4" />,
  'best-practices': <CheckCircle2 className="w-4 h-4" />,
  'technical': <Code2 className="w-4 h-4" />,
};

export function LearnSidebar({ articles }: LearnSidebarProps) {
  const pathname = usePathname();
  const currentSlug = pathname?.split('/').pop();

  const articlesByCategory = LEARN_CATEGORIES.map(cat => ({
    ...cat,
    icon: CATEGORY_ICONS[cat.slug],
    articles: articles
      .filter(a => a.category === cat.slug)
      .sort((a, b) => a.order - b.order),
  }));

  return (
    <nav className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide shadow-xl shadow-black/10">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-700/50">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="font-semibold text-white">Learn QR Codes</h4>
          <p className="text-xs text-slate-400">Knowledge Base</p>
        </div>
      </div>

      <div className="space-y-5">
        {articlesByCategory.map(category => (
          <div key={category.slug}>
            <Link
              href={`/learn/category/${category.slug}`}
              className="group flex items-center justify-between mb-2 p-2 -mx-2 rounded-lg hover:bg-slate-700/30 transition-all"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/10 to-cyan-500/10 flex items-center justify-center text-primary group-hover:from-primary/20 group-hover:to-cyan-500/20 transition-colors">
                  {category.icon}
                </div>
                <span className="font-medium text-sm text-slate-300 group-hover:text-white transition-colors">
                  {category.label}
                </span>
              </div>
              {category.articles.length > 0 && (
                <Badge variant="outline" className="text-xs border-slate-600/50 text-slate-500">
                  {category.articles.length}
                </Badge>
              )}
            </Link>
            {category.articles.length > 0 && (
              <ul className="space-y-0.5 ml-2 relative">
                {/* Vertical line */}
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-700/50 rounded-full" />

                {category.articles.map(article => {
                  const isActive = currentSlug === article.slug;

                  return (
                    <li key={article.slug} className="relative">
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-gradient-to-b from-primary to-cyan-500 rounded-full" />
                      )}
                      <Link
                        href={`/learn/${article.slug}`}
                        className={cn(
                          'group/item flex items-center gap-2 py-2 pl-4 pr-2 text-sm transition-all rounded-lg hover:bg-slate-700/30',
                          isActive
                            ? 'text-primary font-medium bg-primary/10'
                            : 'text-slate-400 hover:text-white'
                        )}
                      >
                        <ChevronRight className={cn(
                          'w-3 h-3 transition-transform',
                          isActive ? 'text-primary' : 'text-slate-600 group-hover/item:text-slate-400'
                        )} />
                        <span className="line-clamp-1">{article.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
