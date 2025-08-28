import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import logoImage from "@/lib/logos/preloader.png";

const upcomingEvents = [
  {
    id: 1,
    title: "AI Training for Delegates",
    description: "A 2-Day Free AI Training to be held in Harare in September 2025 (exact venue and date to be announced). This training will be facilitated by experts from academia and industry.",
    date: "September 2025",
    location: "Harare (venue to be announced)",
    time: "To be announced",
    status: "Registration Opening Soon",
    expectedAttendees: 150,
    highlights: [
      "Expert facilitators from academia and industry",
      "Comprehensive 2-day curriculum",
      "Free training for all delegates",
      "Practical AI applications and case studies"
    ],
    registrationUrl: "#",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500",
  },
];

export default function UpcomingEvents() {
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
              Upcoming Events
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
              Join us at our upcoming AI events, workshops, and conferences designed to advance AI research and education across Africa.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {upcomingEvents.map((event) => (
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
                      className="absolute top-4 right-4 bg-green-500/90 text-white"
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
                    </div>

                    <div className="pt-4">
                      <Button
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                        asChild
                      >
                        <a
                          href={event.registrationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2"
                        >
                          Register Now
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {upcomingEvents.length === 0 && (
            <motion.div
              variants={fadeInUp}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Upcoming Events
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We're planning exciting events for the future. Stay tuned for announcements!
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.section>
    </div>
  );
}