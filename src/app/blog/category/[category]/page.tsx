import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { blogPosts } from '#content';
import { PublicNav } from '@/components/layout/PublicNav';
import { Footer } from '@/components/layout/Footer';
import { ArticleCard } from '@/components/content';
import { Badge } from '@/components/ui/badge';
import { BLOG_CATEGORIES } from '@/lib/content/utils';
import { ChevronRight, PenLine } from 'lucide-react';

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return BLOG_CATEGORIES.map(cat => ({ category: cat.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryInfo = BLOG_CATEGORIES.find(c => c.slug === category);

  if (!categoryInfo) return {};

  return {
    title: `${categoryInfo.label} - Blog`,
    description: `${categoryInfo.description}. QR code articles and insights from QRWolf.`,
    openGraph: {
      title: `${categoryInfo.label} - QRWolf Blog`,
      description: `${categoryInfo.description}. QR code articles and insights from QRWolf.`,
    },
  };
}

export default async function BlogCategoryPage({ params }: PageProps) {
  const { category } = await params;
  const categoryInfo = BLOG_CATEGORIES.find(c => c.slug === category);

  if (!categoryInfo) {
    notFound();
  }

  const posts = blogPosts
    .filter(post => !post.draft && post.category === category)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <>
      <PublicNav showAuthButtons={true} />
      <main className="min-h-screen pt-24 pb-16 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Floating orbs */}
          <div className="absolute top-40 right-10 w-80 h-80 rounded-full bg-primary/20 blur-[120px] animate-pulse" />
          <div className="absolute top-80 left-20 w-72 h-72 rounded-full bg-cyan-500/15 blur-[150px]" />
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
            <Link href="/blog" className="hover:text-primary transition-colors flex items-center gap-1">
              <PenLine className="w-4 h-4" />
              Blog
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <span className="text-slate-500">{categoryInfo.label}</span>
          </nav>

          {/* Header */}
          <div className="text-center mb-12 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              {posts.length} {posts.length === 1 ? 'Post' : 'Posts'}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-tight">
              {categoryInfo.label}
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {categoryInfo.description}
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <Link href="/blog">
              <Badge variant="outline" className="cursor-pointer border-slate-600/50 text-slate-400 hover:border-primary/50 hover:text-primary hover:bg-primary/10 transition-all px-4 py-1.5">
                All Posts
              </Badge>
            </Link>
            {BLOG_CATEGORIES.map(cat => (
              <Link key={cat.slug} href={`/blog/category/${cat.slug}`}>
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

          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-400 text-lg mb-4">
                No posts in this category yet.
              </p>
              <Link href="/blog" className="text-primary hover:underline">
                View all posts
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <ArticleCard
                  key={post.slug}
                  title={post.title}
                  description={post.description}
                  slug={post.slug}
                  date={post.date}
                  category={post.category}
                  tags={post.tags}
                  image={post.image}
                  wordCount={post.metadata.wordCount}
                  type="blog"
                  featured={post.featured}
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
