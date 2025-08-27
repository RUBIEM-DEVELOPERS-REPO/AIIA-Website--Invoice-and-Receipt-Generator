import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Users, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import logoImage from "@/lib/logos/preloader.png";
import aiSummitAfricaImage from "@/lib/event_images/ai_summit_africa_2025.jpg";
import teloneTrainingImage from "@/lib/event_images/telone_ai_training.jpg";

const pastEvents = [
  {
    id: 1,
    title: "AI Summit for Africa 2025",
    description: "The summit was a powerful convergence of vision and practicality. The message was unanimous: our future depends on bold leadership, collaboration, and a definitive shift from talk to implementation. Africa's moment is now. Let's build it.",
    date: "17-20 August, 2025",
    location: "Elephant Hills Victoria Falls",
    time: "9:00 AM - 5:00 PM",
    status: "Completed",
    attendees: 300,
    highlights: [
      "Keynote on AI in Government Operations",
      "Panel Discussion on Digital Transformation",
      "AI Demonstration Sessions",
      "Networking with Industry Leaders"
    ],
    image: aiSummitAfricaImage,
  },
  {
    id: 2,
    title: "AI Training at TelOne: Shaping the Future of Innovation",
    description: "We hosted a transformative AI training session at TelOne, empowering participants with skills to navigate and lead in an AI-driven world.",
    date: "June 2025",
    location: "Telone Centre for Learning",
    time: "9:00 AM - 5:00 PM",
    status: "Completed",
    attendees: 45,
    highlights: [
      "Data Transformation: Fueling Intelligent Systems",
      "Practical Tools for Real-World AI",
      "The Future of Work: AI & Jobs",
      "AI's Disruption in Telecom & Education"
    ],
    image: teloneTrainingImage,
  },
];

export default function PastEvents() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-blue-900/10 dark:to-purple-900/10">
      <motion.section
        className="py-24 px-8"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="container mx-auto max-w-7xl">
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <div className="flex justify-center mb-4">
              <img
                src={logoImage}
                alt="AiiA Logo"
                className="h-8 transition-transform transform hover:scale-105"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-red-600 bg-clip-text text-transparent">
              Past Events
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
              Explore our successful AI events, conferences, and workshops that have contributed to advancing AI education and research across Africa.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {pastEvents.map((event) => (
              <motion.div
                key={event.id}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="h-full"
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                  <div className="relative h-48 rounded-t-lg overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Badge
                      className="absolute top-4 right-4 bg-gray-500/90 text-white"
                      variant="secondary"
                    >
                      {event.status}
                    </Badge>
                  </div>

                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
                      {event.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                      {event.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Users className="w-4 h-4 text-primary" />
                        <span>{event.attendees} attendees</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        Event Highlights
                      </h4>
                      <ul className="space-y-1">
                        {event.highlights.map((highlight, index) => (
                          <li
                            key={index}
                            className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2"
                          >
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {pastEvents.length === 0 && (
            <motion.div
              variants={fadeInUp}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Past Events
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our event history will be displayed here as we continue organizing impactful AI events.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.section>
    </div>
  );
}