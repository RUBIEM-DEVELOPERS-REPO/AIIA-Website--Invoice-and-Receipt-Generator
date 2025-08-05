import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PROJECTS } from "@/lib/constants";
import ProjectCard from "@/components/sections/project-card";
import logoImage2 from "@/lib/logos/preloader.png";

export default function PermanentSecretariesEvent() {
  console.log("PROJECTS:", PROJECTS);
  console.log("PROJECTS length:", PROJECTS.length);
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-blue-900/10 dark:to-purple-900/10">
      {/* Projects Section */}
      <motion.section
        className="py-24 px-8"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
          >
            <div className="flex justify-center mb-4">
              <img
                src={logoImage2}
                alt="AiiA Logo"
                className="h-8 transition-transform transform hover:scale-105"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
              Projects
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover our cutting-edge AI projects that are transforming communities across Africa. 
              From healthcare to agriculture, we're building the future of AI in Africa.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
          >
            {PROJECTS.map((project) => (
              <motion.div key={project.id} variants={item}>
                <ProjectCard {...project} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="text-center mt-12"
            variants={fadeInUp}
          >
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              View All Projects
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}