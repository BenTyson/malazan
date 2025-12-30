import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BookOpen } from 'lucide-react';

interface RelatedArticle {
  title: string;
  description: string;
  slug: string;
  category: string;
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
  type: 'blog' | 'learn';
}

export function RelatedArticles({ articles, type }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="mt-16 pt-10 relative">
      {/* Gradient divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Continue Reading</h3>
          <p className="text-sm text-slate-400">Related articles you might enjoy</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {articles.map((article, index) => {
          const href = type === 'blog' ? `/blog/${article.slug}` : `/learn/${article.slug}`;
          return (
            <Link
              key={article.slug}
              href={href}
              className="group animate-slide-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <Card className="h-full bg-slate-800/50 backdrop-blur-xl border-slate-700/50 transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02] hover:-translate-y-1">
                <CardHeader>
                  <Badge className="w-fit text-xs mb-2 capitalize bg-primary/10 text-primary border-primary/20">
                    {article.category.replace('-', ' ')}
                  </Badge>
                  <CardTitle className="text-base group-hover:text-primary transition-colors flex items-center gap-2">
                    <span className="line-clamp-2">{article.title}</span>
                    <ArrowRight className="w-4 h-4 shrink-0 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </CardTitle>
                  <CardDescription className="text-sm line-clamp-2 text-slate-400">
                    {article.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
