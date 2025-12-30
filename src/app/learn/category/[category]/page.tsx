import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { learnArticles } from '#content';
import { PublicNav } from '@/components/layout/PublicNav';
import { Footer } from '@/components/layout/Footer';
import { ArticleCard } from '@/components/content';
import { Badge } from '@/components/ui/badge';
import { LEARN_CATEGORIES } from '@/lib/content/utils';
import { BookOpen, Cog, Lightbulb, Building2, CheckCircle2, Code2, ChevronRight, GraduationCap } from 'lucide-react';

interface PageProps {
  params: Promise<{ category: string }>;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'qr-basics': <BookOpen className="w-8 h-8" />,
  'how-it-works': <Cog className="w-8 h-8" />,
  'use-cases': <Lightbulb className="w-8 h-8" />,
  'industries': <Building2 className="w-8 h-8" />,
  'best-practices': <CheckCircle2 className="w-8 h-8" />,
  'technical': <Code2 className="w-8 h-8" />,
};

export async function generateStaticParams() {
  return LEARN_CATEGORIES.map(cat => ({ category: cat.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryInfo = LEARN_CATEGORIES.find(c => c.slug === category);

  if (!categoryInfo) return {};

  return {
    title: `${categoryInfo.label} - Learn QR Codes`,
    description: `${categoryInfo.description}. Learn everything about QR codes with QRWolf.`,
    openGraph: {
      title: `${categoryInfo.label} - Learn QR Codes | QRWolf`,
      description: `${categoryInfo.description}. Learn everything about QR codes with QRWolf.`,
    },
  };
}

export default async function LearnCategoryPage({ params }: PageProps) {
  const { category } = await params;
  const categoryInfo = LEARN_CATEGORIES.find(c => c.slug === category);

  if (!categoryInfo) {
    notFound();
  }

  const articles = learnArticles
    .filter(article => !article.draft && article.category === category)
    .sort((a, b) => a.order - b.order);

  const icon = CATEGORY_ICONS[category];

  return (
    <>
      <PublicNav showAuthButtons={true} />
      <main className="min-h-screen pt-24 pb-16 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Floating orbs */}
          <div className="absolute top-40 left-10 w-80 h-80 rounded-full bg-primary/20 blur-[120px] animate-pulse" />
          <div className="absolute top-80 right-20 w-72 h-72 rounded-full bg-cyan-500/15 blur-[150px]" />
          {/* Dot pattern */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(rgba(20, 184, 166, 0.15) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto px-4 relative">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8 animate-fade-in">
            <Link href="/learn" className="hover:text-primary transition-colors flex items-center gap-1">
              <GraduationCap className="w-4 h-4" />
              Learn
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <span className="text-slate-500">{categoryInfo.label}</span>
          </nav>

          {/* Header */}
          <div className="text-center mb-12 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center text-primary mx-auto mb-6 shadow-xl shadow-primary/10">
              {icon}
            </div>
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              {articles.length} {articles.length === 1 ? 'Article' : 'Articles'}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-tight">
              {categoryInfo.label}
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {categoryInfo.description}
            </p>
          </div>

          {/* Category Quick Nav */}
          <div className="flex flex-wrap justify-center gap-2 mb-12 animate-fade-in" style={{ animationDelay: '200ms' }}>
            {LEARN_CATEGORIES.map(cat => (
              <Link key={cat.slug} href={`/learn/category/${cat.slug}`}>
                <Badge
                  className={cat.slug === category
                    ? 'cursor-pointer bg-primary text-primary-foreground px-4 py-1.5'
                    : 'cursor-pointer border-slate-600/50 text-slate-400 hover:border-primary/50 hover:text-primary hover:bg-primary/10 transition-all px-4 py-1.5'
                  }
                  variant={cat.slug === category ? 'default' : 'outline'}
                >
                  {cat.label}
                </Badge>
              </Link>
            ))}
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-400 text-lg mb-4">
                No articles in this category yet.
              </p>
              <Link href="/learn" className="text-primary hover:underline">
                Browse all categories
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <ArticleCard
                  key={article.slug}
                  title={article.title}
                  description={article.description}
                  slug={article.slug}
                  category={article.category}
                  tags={article.tags}
                  image={article.image}
                  wordCount={article.metadata.wordCount}
                  type="learn"
                  featured={index === 0}
                  animationDelay={index * 80}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
