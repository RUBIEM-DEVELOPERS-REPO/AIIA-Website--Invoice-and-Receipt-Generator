import { ArrowRight } from "lucide-react";
import { BOARD_MEMBERS } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LottieAnimation } from "@/components/ui/lottie-animation";
import animationDataX from "@/lib/lotties/X.json";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import logoImage from "@/lib/logos/preloader.png";

export default function About() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-24">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1703435525194-9d96cefa7f7c)`,
            filter: "brightness(0.3)",
          }}
        />
        <div className="relative z-10 container px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            About Our Institute
          </h1>
          <p className="text-xl text-white  max-w-2xl">
            Pioneering AI research and education in Africa to drive
            technological innovation and sustainable development across the
            continent.
          </p>
        </div>
      </section>

      <section className="py-16 bg-primary/5">
        <div className="container px-8">
          <h2 className="text-3xl font-bold mb-8">Our Background</h2>
          <div className="grid md:grid-cols-3 gap-12 items-start px-4">
            <div className="space-y-6">
              <p className="text-muted-foreground">
                Inspired by the Government of Zimbabwe's National Development
                Strategy 1 (NDS1), SADC Vision 2050, African Union's Agenda 2063
                and the United Nations' Sustainable Development Goals, we desire
                to harness AI for the social-economic of Zimbabwe and Africa at
                large. Drawing inspiration from similar organizations, such as
                Zimbabwe Institute of Engineers, Institute of People Management
                Zimbabwe, AI institutes and associations in the world,
                marketers’ association, scientific societies, Internet Society
                Africa or professional networks
              </p>
              <p className="text-muted-foreground">
                Recognizing the transformative potential of AI, we, the founders
                of the AIIA, acknowledge the need for interdisciplinary and
                Pan-African approaches to ensure AI benefits everyone and every
                place. Recognizing the potential of AI to drive economic growth,
                improve livelihoods, and address complex challenges in Zimbabwe,
                SADC and Africa in general, we, the founders of the AIIA,
                acknowledge the need for a unified national and continental
                voice and collective action to:
              </p>
            </div>

            <div className="space-y-6">
              <ul className="list-disc pl-6 space-y-2">
                <li className="flex items-start gap-4">
                  <ArrowRight className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  Drive National Development
                </li>
                <li className="flex items-start gap-4">
                  <ArrowRight className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  Drive Regional and Continental Development
                </li>
                <li className="flex items-start gap-4">
                  <ArrowRight className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  Enable Africa’s Participation
                </li>
                <li className="flex items-start gap-4">
                  {" "}
                  <ArrowRight className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  Collaborate in Zimbabwe, SADC and Africa at large
                </li>
                <li className="flex items-start gap-4">
                  <ArrowRight className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  Promote responsible AI development
                </li>
                <li className="flex items-start gap-4">
                  <ArrowRight className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  Facilitate Inclusivity
                </li>
                <li className="flex items-start gap-4">
                  <ArrowRight className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  Promote AI literacy in Zimbabwe and Africa at large
                </li>
                <li className="flex items-start gap-4">
                  <ArrowRight className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  Leverage AI to Drive Vision 2030
                </li>
                <li className="flex items-start gap-4">
                  <ArrowRight className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  Drive Sustainable Development Goals
                </li>
                <li className="flex items-start gap-4">
                  <ArrowRight className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  Add Supporting Leading Edge Technologies
                </li>
              </ul>
            </div>

            <div className="relative h-[300px] rounded-lg overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(https://images.unsplash.com/photo-1531482615713-2afd69097998)`,
                  filter: "brightness(0.9)",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 container px-8">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground">
              To empower African talent through world-class AI education,
              research, and innovation, creating solutions that address the
              continent's unique challenges and opportunities.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-muted-foreground">
              To establish Africa as a global leader in AI innovation, fostering
              a thriving ecosystem of researchers, entrepreneurs, and industry
              partners.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-primary/5  flex flex-col items-center justify-center">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-bold mb-2">Excellence</h3>
              <p className="text-muted-foreground">
                Pursuing the highest standards in research and education
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="font-bold mb-2">Collaboration</h3>
              <p className="text-muted-foreground">
                Building partnerships across academia and industry
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="font-bold mb-2">Innovation</h3>
              <p className="text-muted-foreground">
                Driving technological advancement in Africa
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Board Section */}
      <section className="py-16 bg-background flex flex-col items-center justify-center">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-center">
            {" "}
            <div className="flex justify-center">
              <img
                src={logoImage}
                alt="AiiA Logo"
                className="h-8 transition-transform transform hover:scale-105"
              />
            </div>{" "}
            Meet Our Board
          </h2>
          {Object.entries(BOARD_MEMBERS).map(([key, section]) => (
            <div key={key} className="mb-16">
              <h3 className="text-2xl font-semibold mb-8 text-center">
                {section.title}
              </h3>
              <div
                className={`
                ${
                  key === "executive"
                    ? "flex justify-center"
                    : key === "directors"
                      ? "grid md:grid-cols-3 gap-2"
                      : "grid md:grid-cols-4"
                } gap-2 mb-8  justify-items-center`}
              >
                {section.members.map((member, index) => (
                  <Dialog key={index}>
                    <DialogTrigger asChild>
                      <Card className="hover:shadow-lg transition-all duration-300 w-128 h-[480px] cursor-pointer">
                        <CardHeader className="text-center">
                          <div className="w-64 h-64 mx-auto mb-4 relative rounded-full overflow-hidden">
                            <img
                              src={member.image}
                              alt={member.name}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <CardTitle>{member.name}</CardTitle>
                          <p className="text-base font-medium text-muted-foreground">
                            {member.role}
                          </p>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-center gap-4">
                            {member.socials.linkedin && (
                              <a
                                href={member.socials.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="32"
                                  height="32"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                  <rect width="4" height="12" x="2" y="9" />
                                  <circle cx="4" cy="4" r="2" />
                                </svg>
                              </a>
                            )}
                            {member.socials.twitter && (
                              <a
                                href={member.socials.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary"
                              >
                                <div className="w-8 h-8">
                                  <LottieAnimation
                                    animationData={animationDataX}
                                    className="w-full h-full"
                                  />
                                </div>
                              </a>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-full sm:max-w-2xl max-h-[90vh] p-4 overflow-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl">
                          {member.name}
                        </DialogTitle>
                        <DialogDescription className="text-lg font-medium text-primary">
                          {member.role}
                        </DialogDescription>
                      </DialogHeader>
                      <ScrollArea className="h-full max-h-[60vh]">
                        <div className="grid gap-4 py-4">
                          <div className="flex items-center justify-center">
                            <img
                              src={member.image}
                              alt={member.name}
                              className="w-48 h-48 rounded-full object-cover"
                            />
                          </div>
                          <p className="text-lg leading-relaxed">
                            {member.bio}
                          </p>
                          <div className="flex justify-center gap-4">
                            {member.socials.linkedin && (
                              <a
                                href={member.socials.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-linkedin"
                                >
                                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                  <rect width="4" height="12" x="2" y="9" />
                                  <circle cx="4" cy="4" r="2" />
                                </svg>
                              </a>
                            )}
                            {member.socials.twitter && (
                              <a
                                href={member.socials.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary w-8 h-8"
                              >
                                <LottieAnimation
                                  animationData={animationDataX}
                                  className="w-full h-full"
                                />
                              </a>
                            )}
                          </div>
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
