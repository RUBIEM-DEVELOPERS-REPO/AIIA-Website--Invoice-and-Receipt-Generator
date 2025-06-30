import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { EVENTS } from "@/lib/constants";
import { format } from "date-fns";
import { useState } from "react";
import { Event } from "@/types/events";
import { SelectEvent } from "@db/schema";
import heroimage1 from "@/lib/hero_images/event.png";
import { useQuery } from "@tanstack/react-query";
import { ConferenceSection } from "@/components/sections/conference-section";
import { ConferenceModal, useConferenceModal } from "@/components/ui/conference-modal";
import { Users, Star, Award } from "lucide-react";

// Speaker data extracted from the conference poster
const CONFERENCE_SPEAKERS = [
  {
    name: "Hon. Tomoka A. Mnyenera (MP)",
    title: "Minister of ICT Postal and Courier Services (Zimbabwe)",
    role: "Guest of Honour",
    category: "keynote"
  },
  {
    name: "Dr Dennis Maposa",
    title: "Chairperson Artificial Intelligence Institute Africa (AiiA), Robotic Founder/CEO",
    role: "Summit Chairperson", 
    category: "keynote"
  },
  {
    name: "Mr Adan Iscali",
    title: "Founder Swisscoin, Author and 3 Dimensional Laser (USA)",
    role: "Speaker",
    category: "speaker"
  },
  {
    name: "Mr Luckwell Mukandi",
    title: "CEO DEV5 Sync & Consulting, Engineering (Zimbabwe)",
    role: "Speaker",
    category: "speaker"
  },
  {
    name: "Mr Gilbert Kygurasimire",
    title: "CEO President, Commercial Attachments",
    role: "Speaker",
    category: "speaker"
  },
  {
    name: "Mr Philip Johnson",
    title: "Co-Founder/CEO Blockchain - Artificial Intelligence (USA)",
    role: "Speaker",
    category: "speaker"
  },
  {
    name: "Dr Lucy Fraboni",
    title: "Managing Director EPC - Air Development (Botswana)",
    role: "Speaker",
    category: "speaker"
  },
  {
    name: "Mr John Kamanja",
    title: "Founder/CEO Artificial Intelligence Analytics of Excellence (Africa)",
    role: "Speaker",
    category: "speaker"
  },
  {
    name: "Dr Die Son",
    title: "Chief Product Officer - LINIO Principal Consultant - National University (USA)",
    role: "Speaker",
    category: "speaker"
  },
  {
    name: "Prof Robert Ole Deacon",
    title: "Professor of Engineering, University of Science and Technology Society (Ghana)",
    role: "Speaker",
    category: "speaker"
  },
  {
    name: "George Maria Odoom-kwaku",
    title: "Artificial Intelligence Researcher Department (Germany)",
    role: "Speaker",
    category: "speaker"
  },
  {
    name: "Prof Dan Griffiths",
    title: "Deputy Vice-Chancellor, Acting University (Zimbabwe)",
    role: "Speaker",
    category: "speaker"
  },
  {
    name: "Mr Kevin Rugema",
    title: "CEO MKR A Technology Advisory Member",
    role: "Speaker",
    category: "speaker"
  }
];

// Map SelectEvent to the Event type used in the component
const mapApiEventToEvent = (apiEvent: SelectEvent): Event => {
  // Process image URL - if it starts with /lib/ it's a local image
  let imageUrl = apiEvent.imageUrl || heroimage1.toString();
  
  // If it's a local path that doesn't start with http, make it relative to the site root
  if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
    // If the path starts with /lib/, it's already correct. Otherwise, ensure proper formatting
    imageUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  }
  
  return {
    title: apiEvent.title,
    content: apiEvent.description,
    venue: apiEvent.location,
    image: imageUrl,
    duration: `${format(new Date(apiEvent.date), "MMM d, yyyy")} - ${apiEvent.type}`,
    endDate: new Date(apiEvent.date).toISOString(),
    registrationLink: apiEvent.registrationUrl || undefined,
  };
};

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showFullImage, setShowFullImage] = useState(false);
  const { isOpen, closeModal } = useConferenceModal();

  // Fetch events from the API
  const { data: apiEvents, isLoading, error } = useQuery<SelectEvent[]>({
    queryKey: ["/api/events"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Use API events if available, otherwise fall back to hardcoded events
  const events = apiEvents && apiEvents.length > 0
    ? apiEvents.map(mapApiEventToEvent)
    : EVENTS;

  return (
    <div className="min-h-screen">
      <ConferenceModal isOpen={isOpen} onClose={closeModal} />
      
      {/* Conference Promotion Section */}
      <ConferenceSection />
      
      {/* Speakers Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-4 border border-primary/20 rounded-full backdrop-blur-sm">
              <Users className="w-4 h-4 mr-2 text-primary" />
              <span className="text-sm font-medium">AI Summit for Africa 2025</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Speakers
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join industry leaders, researchers, and innovators as they share insights on 
              AI-powered transformation across Africa
            </p>
          </div>

          {/* Keynote Speakers */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-800 dark:text-white">
              Keynote Speakers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {CONFERENCE_SPEAKERS.filter(speaker => speaker.category === 'keynote').map((speaker, index) => (
                <Card key={index} className="bg-white/80 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl">
                  <CardHeader className="text-center pb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full mx-auto mb-4 flex items-center justify-center">
                      {speaker.role === "Guest of Honour" ? (
                        <Award className="w-10 h-10 text-white" />
                      ) : (
                        <Star className="w-10 h-10 text-white" />
                      )}
                    </div>
                    <Badge variant="secondary" className="mb-2">
                      {speaker.role}
                    </Badge>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                      {speaker.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                      {speaker.title}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Regular Speakers */}
          <div>
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-800 dark:text-white">
              Expert Speakers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CONFERENCE_SPEAKERS.filter(speaker => speaker.category === 'speaker').map((speaker, index) => (
                <Card key={index} className="bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white text-center">
                      {speaker.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 text-sm text-center leading-relaxed">
                      {speaker.title}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Registration CTA */}
          <div className="text-center mt-12">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Don't miss this opportunity to learn from Africa's leading AI experts
            </p>
            <Button size="lg" className="px-8 py-3">
              Register Now
            </Button>
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

      {/* Events Listing Section */}
      <div className="container mx-auto py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Upcoming Events</h2>
          <div className="flex gap-2">
            {/* Add filter buttons here in the future */}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-lg text-red-500">
              There was a problem loading events. Please try again later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((event, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow w-full md:w-3/4 mx-auto"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl">{event.title}</CardTitle>
                    <Badge variant="default">
                      {new Date() < new Date(event.endDate) ? "Upcoming" : "Past"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div
                    className="aspect-video w-full overflow-hidden rounded-lg cursor-pointer group relative"
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowFullImage(true);
                    }}
                  >
                    <img
                      src={event.image}
                      alt={event.title}
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
                  <p className="text-muted-foreground text-lg line-clamp-3">
                    {event.content}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span>{event.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm col-span-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <span>Until {format(new Date(event.endDate), "PPP")}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full text-lg py-6"
                    onClick={() => setSelectedEvent(event)}
                  >
                    Read More
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
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
                  <Button 
                    size="lg" 
                    className="mt-4" 
                    asChild
                  >
                    <a href={selectedEvent.registrationLink} target="_blank" rel="noopener noreferrer">
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
