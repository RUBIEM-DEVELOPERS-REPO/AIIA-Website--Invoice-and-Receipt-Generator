import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Phone,
  Mail,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { useLocation } from "wouter";
import conferenceImage from "@/lib/images/conference-2025.jpg";
import speakersImage from "@/lib/images/ai confere.jpg";

export default function AIAfricaSummit() {
  const [location] = useLocation();
  const [activeSection, setActiveSection] = useState("Concert");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get("section");
    if (section) {
      setActiveSection(section);
    }
  }, [location]);

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    // Use URL params without pushState to avoid security errors
    const url = new URL(window.location.href);
    url.searchParams.set("section", sectionId);
    window.history.replaceState({}, "", url.toString());
  };

  const sections = [
    {
      id: "Concert",
      title: "AI Africa Summit 2025",
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      id: "Venue",
      title: "Venue Information",
      icon: <MapPin className="w-5 h-5" />,
    },
    {
      id: "Speakers",
      title: "Speakers & Program",
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: "Registration",
      title: "Registration",
      icon: <ExternalLink className="w-5 h-5" />,
    },
    {
      id: "Call/Contact",
      title: "Contact Information",
      icon: <Phone className="w-5 h-5" />,
    },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "Concert":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  AI Africa Summit 2025
                </h2>
                <p className="text-xl text-gray-200 mb-6 max-w-2xl">
                  Join Africa's premier AI conference bringing together
                  innovators, researchers, and industry leaders to shape the
                  future of artificial intelligence on the continent.
                </p>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={conferenceImage}
                alt="AI Africa Summit 2025"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
                <h3 className="font-semibold text-lg mb-2">Date</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  17 - 20 AUG 2025
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
                <MapPin className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-3" />
                <h3 className="font-semibold text-lg mb-2">Location</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Victoria Falls Zimbabwe
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 p-6 rounded-xl border border-green-200 dark:border-green-800">
                <Users className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
                <h3 className="font-semibold text-lg mb-2">
                  Expected Attendees
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  500+ Participants
                </p>
              </div>
            </div>
          </motion.div>
        );

      case "Venue":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 rounded-2xl p-8 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Venue Information
              </h2>
              <p className="text-xl text-gray-200 mb-6">
                The AI Africa Summit 2025 will be hosted at a world-class venue
                that embodies innovation and technology.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                    Venue Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Location
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          Elephant Hills, Victoria Falls{" "}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Capacity
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          500+ attendees with modern facilities
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Features
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          State-of-the-art AV equipment and networking spaces
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
                  <h4 className="text-lg font-semibold mb-3 text-emerald-900 dark:text-emerald-100">
                    Accessibility
                  </h4>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>• Wheelchair accessible facilities</li>
                    <li>• Public transportation access</li>
                    <li>• Parking available on-site</li>
                    <li>• Nearby accommodation options</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Elephant Hills Resort
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Elephant Hills Resort rises above the Zambezi River like a
                    beacon of innovation meeting natural wonder. Located just
                    minutes from the awe-inspiring Victoria Falls, this luxury
                    retreat blends high-end hospitality with expansive
                    conference facilities, making it the perfect home for
                    Africa’s premier AI Summit. Its 276 spacious rooms,
                    world-class service, and tranquil bush surroundings provide
                    the perfect setting for creative thinking and global
                    collaboration. With its cutting-edge tech infrastructure and
                    panoramic views that inspire future-focused conversations,
                    Elephant Hills isn't just a venue , it’s a statement.
                    Hosting the continent’s biggest gathering of artificial
                    intelligence leaders here symbolizes Africa's leap into the
                    future, powered by heritage, nature, and digital
                    transformation.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "Speakers":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900 rounded-2xl p-8 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Speakers & Program
              </h2>
              <p className="text-xl text-gray-200 mb-6">
                Learn from world-renowned AI experts, researchers, and industry
                pioneers who are shaping the future of artificial intelligence
                in Africa.
              </p>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={speakersImage}
                alt="AI Conference Speakers"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold mb-2">
                  Distinguished Speakers
                </h3>
                <p className="text-lg text-gray-200">
                  Featuring leading voices in AI research and innovation
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Keynote Sessions</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Inspiring talks from AI pioneers and thought leaders
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Technical Workshops
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Hands-on sessions with cutting-edge AI technologies
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Panel Discussions
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Interactive debates on AI's future in Africa
                </p>
              </div>
            </div>
          </motion.div>
        );

      case "Registration":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-2xl p-8 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
                Event Registration
              </h2>
              <p className="text-xl text-gray-200 mb-6">
                Secure your spot at Africa's most anticipated AI conference.
                Limited seats available!
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border">
              <div className="flex items-center gap-3 mb-6">
                <ExternalLink className="w-6 h-6 text-indigo-600" />
                <h3 className="text-2xl font-semibold">Registration Form</h3>
              </div>

              <div className="w-full h-[600px] md:h-[700px] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <iframe
                  src="https://docs.google.com/forms/d/e/1FAIpQLSfaTEz5rXmI_iS844F6SaQF4_tvZsr5MJrcnXYtIrWO5Ff3WQ/viewform"
                  className="w-full h-full"
                  frameBorder="0"
                  title="AI Africa Summit Registration Form"
                >
                  Loading registration form...
                </iframe>
              </div>

              <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-950 rounded-lg border border-indigo-200 dark:border-indigo-800">
                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                  <strong>Note:</strong> If the form doesn't load properly, you
                  can{" "}
                  <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSfaTEz5rXmI_iS844F6SaQF4_tvZsr5MJrcnXYtIrWO5Ff3WQ/viewform"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-indigo-900 dark:hover:text-indigo-100"
                  >
                    open it in a new tab
                  </a>
                  .
                </p>
              </div>
            </div>
          </motion.div>
        );

      case "Call/Contact":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-green-900 via-teal-900 to-blue-900 rounded-2xl p-8 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Contact Information
              </h2>
              <p className="text-xl text-gray-200 mb-6">
                Get in touch with our team for inquiries, partnerships, or
                support regarding the AI Africa Summit 2025.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border">
                  <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                    Contact Details
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                      <Phone className="w-5 h-5 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white mb-1">
                          Phone Numbers
                        </p>
                        <div className="space-y-1">
                          <p className="text-gray-700 dark:text-gray-300">
                            Wilson: +263 773 277 599
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            Robert: +263 772 222 283
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            Olga: +263 784 102 843
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            Jack: +263 773 417 267
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                      <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white mb-1">
                          Email
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          events@alphamedia.co.zw
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
                      <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white mb-1">
                          Office Address
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          275 Herbet Chitepo
                          <br />
                          Harare, Zimbabwe
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-950 dark:to-blue-950 rounded-xl p-6 border border-teal-200 dark:border-teal-800">
                  <h4 className="text-lg font-semibold mb-3 text-teal-900 dark:text-teal-100">
                    Business Hours
                  </h4>
                  <div className="space-y-2 text-gray-700 dark:text-gray-300">
                    <p>
                      <span className="font-medium">Monday - Friday:</span> 8:00
                      AM - 5:00 PM (CAT)
                    </p>
                    <p>
                      <span className="font-medium">Saturday:</span> 9:00 AM -
                      1:00 PM (CAT)
                    </p>
                    <p>
                      <span className="font-medium">Sunday:</span> Closed
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                    Quick Contact
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Subject
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white">
                        <option value="">Select a topic</option>
                        <option value="registration">
                          Registration Inquiry
                        </option>
                        <option value="sponsorship">
                          Sponsorship Opportunities
                        </option>
                        <option value="speaking">Speaking Opportunities</option>
                        <option value="general">General Information</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Message
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                        placeholder="Your message..."
                      />
                    </div>
                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium">
                      Send Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Hero Section with Navigation */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="relative container mx-auto px-4 py-8">
          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionChange(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  activeSection === section.id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                    : "bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md"
                }`}
              >
                {section.icon}
                <span className="hidden sm:inline">{section.title}</span>
                <span className="sm:hidden">{section.id}</span>
              </button>
            ))}
          </div>

          {/* Content Section */}
          <AnimatePresence mode="wait">
            <div key={activeSection}>{renderContent()}</div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
