import { useQuery } from "@tanstack/react-query";
import NewsCard from "@/components/sections/news-card";
import { motion } from "framer-motion";
import { ARTICLE_ITEMS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, ChevronRight } from "lucide-react";

interface NewsArticle {
  title: string;
  description: string;
  publishedAt: string;
  urlToImage: string;
  url: string;
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function News() {
  const { data: newsArticles, isLoading } = useQuery<NewsArticle[]>({
    queryKey: ["/api/news"],
    select: (data) => {
      return [...data].sort(() => Math.random() - 0.5);
    },
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-24">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1655393001768-d946c97d6fd1)`,
            filter: "brightness(0.3)",
          }}
        />
        <div className="relative z-10 container px-8">
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Latest AI News & Innovations
          </motion.h1>
          <motion.p
            className="text-xl text-gray-200 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Stay updated with the latest breakthroughs in artificial
            intelligence, machine learning, and emerging AI technologies shaping
            our future.
          </motion.p>
          <motion.div
            className="flex flex-wrap py-8 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 transition-all hover:scale-105 group"
            >
              <Link href="/local_articles" className="flex items-center gap-2">
                Explore Some Of Our Local Articles Published by our Doctors
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 container px-8">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-[400px] rounded-lg bg-card animate-pulse"
              />
            ))}
          </div>
        ) : (
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {shuffleArray([
              ...(newsArticles ?? []).map((article) => ({
                title: article.title,
                excerpt: article.description,
                date: new Date(article.publishedAt),
                image:
                  article.urlToImage ||
                  "https://images.unsplash.com/photo-1655393001768-d946c97d6fd1",
                url: article.url,
              })),
              ...ARTICLE_ITEMS,
            ]).map((article, index) => (
              <NewsCard
                key={`${article.title}-${index}`}
                title={article.title}
                excerpt={article.excerpt}
                date={article.date}
                image={article.image}
                url={article.url}
                size={
                  index === 0 ? "large" : index % 3 === 0 ? "small" : "medium"
                }
                delay={index * 0.1}
              />
            ))}
          </motion.div>
        )}
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-primary/5">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">
            Stay Informed on AI Advancements
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive regular updates about AI
            research, breakthroughs, and emerging technologies.
          </p>
          <form
            className="max-w-md mx-auto flex gap-4"
            action="/api/newsletter"
            method="POST"
          >
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
