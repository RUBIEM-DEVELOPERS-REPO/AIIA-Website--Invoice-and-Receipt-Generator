import Hero from "@/components/sections/hero";
import { Button } from "@/components/ui/button";
import { PROGRAMS, NEWS_ITEMS, PROJECTS } from "@/lib/constants";
import ProgramCard from "@/components/sections/program-card";
import ProjectCard from "@/components/sections/project-card";
import NewsCard from "@/components/sections/news-card";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { PartnerShowcase } from "@/components/sections/partner-showcase";
import { ConferenceSection } from "@/components/sections/conference-section";


import logoImage2 from "@/lib/logos/preloader.png";

// Animation variants remain unchanged
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const floatAnimation = {
  y: [-10, 10],
  transition: {
    y: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut",
    },
  },
};

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Hero />

      {/* Programs Section */}
      <motion.section
        className="py-24 px-8"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={container}
      >
        <div className="container mx-auto max-w-7xl">
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            variants={item}
          >
            <div className="flex justify-center">
              <img
                src={logoImage2}
                alt="AiiA Logo"
                className="h-8 transition-transform transform hover:scale-105"
              />
            </div>
            The IV Pillars Which Shape Our Goals Here At The Institute
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROGRAMS.map((program) => (
              <motion.div key={program.title} variants={item}>
                <ProgramCard {...program} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Partner Showcase Section */}
      <div className="flex justify-center">
        <PartnerShowcase />
      </div>

      {/* Conference Section */}
      <ConferenceSection />

      {/* Projects Section */}
      <motion.section
        className="py-24 px-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-blue-900/10 dark:to-purple-900/10"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={container}
      >
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="text-center mb-16"
            variants={item}
          >
            <div className="flex justify-center mb-4">
              <img
                src={logoImage2}
                alt="AiiA Logo"
                className="h-8 transition-transform transform hover:scale-105"
              />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
              Projects
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover our cutting-edge AI projects that are transforming communities across Africa. 
              From healthcare to agriculture, we're building the future of AI in Africa.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROJECTS.map((project) => (
              <motion.div key={project.id} variants={item}>
                <ProjectCard {...project} />
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center mt-12"
            variants={item}
          >
            <Button 
              asChild 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/programs">View All Projects</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Impact Stats */}
      <section className="bg-primary/5 py-24 px-8 relative">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              animate={floatAnimation}
              className="bg-background rounded-lg p-6 shadow-lg"
            >
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">
                Students Trained
              </div>
            </motion.div>
            <motion.div
              animate={floatAnimation}
              className="bg-background rounded-lg p-6 shadow-lg"
            >
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground">
                Research Papers
              </div>
            </motion.div>
            <motion.div
              animate={floatAnimation}
              className="bg-background rounded-lg p-6 shadow-lg"
            >
              <div className="text-4xl font-bold text-primary mb-2">5+</div>
              <div className="text-sm text-muted-foreground">
                Partner Universities
              </div>
            </motion.div>
            <motion.div
              animate={floatAnimation}
              className="bg-background rounded-lg p-6 shadow-lg"
            >
              <div className="text-4xl font-bold text-primary mb-2">15</div>
              <div className="text-sm text-muted-foreground">
                African Countries
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <motion.section
        className="py-24 px-8"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={container}
      >
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="flex justify-between items-center mb-12"
            variants={item}
          >
            <h2 className="text-3xl font-bold">Latest News & Publications </h2>
            <Button asChild variant="outline">
              <Link href="/local_articles">View All News</Link>
            </Button>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {NEWS_ITEMS.map((news) => (
              <motion.div
                key={news.title}
                variants={item}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <NewsCard {...news} url={news.url} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
