import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { useState } from "react";
import { Event } from "@/types/events";
import heroimage1 from "@/lib/hero_images/event.png";
import { ConferenceSection } from "@/components/sections/conference-section";
import {
  ConferenceModal,
  useConferenceModal,
} from "@/components/ui/conference-modal";
import aiConferencePoster from "@/lib/images/poster.jpg";
import brochureImage from "@/lib/images/ai confere.jpg";

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showFullImage, setShowFullImage] = useState(false);
  const { isOpen, closeModal } = useConferenceModal();

  // Download brochure function
  const downloadBrochure = () => {
    const link = document.createElement("a");
    link.href = brochureImage;
    link.download = "AI-Conference-2025-Speakers-Brochure.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen">
      <ConferenceModal isOpen={isOpen} onClose={closeModal} />

      {/* Conference Promotion Section */}
      <ConferenceSection />

      {/* Conference Poster Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-4 border border-primary/20 rounded-full backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2 text-primary" />
              <span className="text-sm font-medium">
                AI Summit for Africa 2025
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Speakers & Conference Details
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join industry leaders, researchers, and innovators for Africa's
              premier AI conference
            </p>
          </div>

          {/* Conference Poster */}
          <div className="flex justify-center mb-12">
            <div className="max-w-4xl w-full">
              <img
                src={brochureImage}
                alt="AI Summit for Africa 2025 - Featured Speakers"
                className="w-full h-auto rounded-2xl shadow-2xl border border-white/20 hover:shadow-3xl transition-shadow duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = heroimage1.toString();
                }}
              />
            </div>
          </div>

          {/* Registration CTA */}
          <div className="text-center">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Don't miss this opportunity to be part of Africa's AI
              transformation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="px-8 py-3"
                onClick={() => window.location.href = '/ai-africa-summit'}
              >
                Register Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-3"
                onClick={downloadBrochure}
              >
                Download Brochure
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <div className="relative bg-black">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroimage1})`,
            filter: "brightness(0.3)",
          }}
        />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-4 border border-primary/20 rounded-full backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2 text-primary" />
              <span className="text-sm font-medium">
                Join Our Community Events
              </span>
            </div>
            <h1 className="text-4xl text-white md:text-5xl lg:text-6xl font-bold tracking-tight">
              Empowering Africa Through AI
            </h1>
            <p className="text-xl text-white text-muted-foreground">
              Discover workshops, conferences, and networking opportunities
              designed to advance AI education and innovation across Africa.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <Button size="lg" className="min-w-[200px]">
                Browse Events
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details Dialog */}
      <Dialog
        open={!!selectedEvent && !showFullImage}
        onOpenChange={() => setSelectedEvent(null)}
      >
        {selectedEvent && (
          <DialogContent className="max-w-6xl max-h-[90vh] w-[95vw] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {selectedEvent.title}
              </DialogTitle>
              <Badge variant="default" className="w-fit">
                {new Date() < new Date(selectedEvent.endDate)
                  ? "Upcoming"
                  : "Past"}
              </Badge>
            </DialogHeader>
            <div className="space-y-6">
              <div
                className="aspect-video w-full overflow-hidden rounded-lg cursor-pointer group relative"
                onClick={() => setShowFullImage(true)}
              >
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = heroimage1.toString();
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-lg font-medium">
                    Click to view
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 py-4 border-y">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>{selectedEvent.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>{selectedEvent.venue}</span>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>
                    Until {format(new Date(selectedEvent.endDate), "PPP")}
                  </span>
                </div>
              </div>
              <DialogDescription className="text-lg leading-relaxed">
                {selectedEvent.content}
              </DialogDescription>

              {selectedEvent.registrationLink && (
                <div className="flex justify-center">
                  <Button size="lg" className="mt-4" asChild>
                    <a
                      href={selectedEvent.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Register for Event
                    </a>
                  </Button>
                </div>
              )}

              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedEvent(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
      {/* Full Image Dialog */}
      <Dialog
        open={!!selectedEvent && showFullImage}
        onOpenChange={() => setShowFullImage(false)}
      >
        {selectedEvent && (
          <DialogContent className="max-w-[95vw] max-h-[95vh] w-auto p-0">
            <div className="relative">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = heroimage1.toString();
                }}
              />
              <Button
                variant="outline"
                className="absolute top-4 right-4"
                onClick={() => setShowFullImage(false)}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
