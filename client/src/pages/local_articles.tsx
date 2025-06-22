import React, { useState, useEffect } from "react";
// LOCAL_ARTICLES is kept only as fallback in case API fails
import { LOCAL_ARTICLES } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import ArticleDialog from "@/components/sections/article-dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { LottieAnimation } from "@/components/ui/lottie-animation";
import animationData from "@/lib/lotties/search.json";
import { Link } from "wouter";
import { ArrowRight, Lock } from "lucide-react";
import { SelectArticle, SelectLocalArticle } from "@db/schema";

const Local_Articles = () => {
  const [selectedArticle, setSelectedArticle] = useState<{
    title: string;
    author: string;
    content: string;
    requirement: string;
  } | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    setIsLoggedIn(!!userData);
  }, []);

  // Fetch local articles from the API
  const { data: localArticles, isLoading, error } = useQuery<SelectLocalArticle[]>({
    queryKey: ["/api/local-articles"],
    staleTime: 1000 * 60 * 5, // 5 minutes
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const handleArticleClick = async (article: SelectLocalArticle | SelectArticle) => {
    try {
      // If membership required and user not logged in, just show the locked dialog
      if (article.requirement === "Membership" && !isLoggedIn) {
        setSelectedArticle({
          title: article.title,
          author: article.author,
          content: '',
          requirement: article.requirement,
        });
        return;
      }

      setSelectedArticle({
        title: article.title,
        author: article.author,
        content: article.content,
        requirement: article.requirement,
      });
    } catch (error) {
      console.error("Error handling article click:", error);
    }
  };

  // Generate SelectLocalArticle compatible objects from LOCAL_ARTICLES if API fails
  const generateSelectLocalArticle = (localArticle: any): SelectLocalArticle => ({
    id: Math.floor(Math.random() * 1000),
    title: localArticle.title,
    author: localArticle.aurthor || 'Unknown Author',
    content: typeof localArticle.content === 'string' ? localArticle.content : '',
    imageUrl: localArticle.image,
    requirement: localArticle.requirement as "Free" | "Membership",
    createdAt: new Date(),
    updatedAt: new Date()
  });

  // Fallback to hardcoded articles if API fails or returns empty
  const displayArticles = localArticles && localArticles.length > 0 
    ? localArticles 
    : LOCAL_ARTICLES.map(generateSelectLocalArticle);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-24 mb-12">
        <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
          <LottieAnimation
            animationData={animationData}
            className="w-full h-full object-contain opacity-30"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 container px-8">
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            AI Research Articles
          </motion.h1>
          <motion.p
            className="text-xl text-gray-200 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Dive deep into our collection of expert-written articles exploring
            the intersection of AI and banking, authored by industry leaders and
            researchers.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <div className="px-8">
        <div className="w-full bg-purple-500/10 py-3 mb-8 overflow-hidden ribbon-container">
          <div className="animate-marquee whitespace-nowrap">
            <span className="mx-4 text-primary">Powered By Innovation</span>
            <span className="mx-4 text-primary">Written by industry experts</span>
            <span className="mx-4 text-primary">Stay informed about the latest in AI technology</span>
            <span className="mx-4 text-primary">Discover the future of banking</span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-lg text-red-500">
              There was a problem loading articles. Please try again later.
            </p>
          </div>
        ) : (
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {displayArticles.map((article: SelectLocalArticle) => (
              <motion.div key={article.id} variants={itemVariants}>
                <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow relative">
                  {article.requirement === "Membership" && (
                    <div className="absolute top-2 right-2 bg-black/50 p-2 rounded-full">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <img
                    src={article.imageUrl || '/placeholder-article.jpg'}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-article.jpg';
                    }}
                  />
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      By {article.author}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleArticleClick(article)}
                      className="bg-primary text-white border border-transparent rounded-lg py-2 px-4 hover:bg-primary/80 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                      aria-label={`Read more about ${article.title}`}
                    >
                      Read More
                    </button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="flex flex-col items-center justify-center py-8">
          <h2 className="text-3xl font-bold mb-6">
            Stay Informed on more AI news And Advancements
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Stay tuned and Discover more thrilling news and articles about AI
            from all over the world.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 transition-all hover:scale-105 group"
          >
            <Link href="/news" className="flex items-center gap-2">
              Explore Other News
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </section>

      {selectedArticle && (
        <ArticleDialog
          isOpen={!!selectedArticle}
          onClose={() => setSelectedArticle(null)}
          title={selectedArticle.title}
          author={selectedArticle.author}
          content={selectedArticle.content}
          requirement={selectedArticle.requirement}
          isLoggedIn={isLoggedIn}
        />
      )}
    </div>
  );
};

export default Local_Articles;