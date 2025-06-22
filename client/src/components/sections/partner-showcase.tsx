import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

import partnerImage1 from "@/lib/logos/UZ_new_logo.png";
import partnerImage2 from "@/lib/logos/rubiem.png";
import partnerImage3 from "@/lib/logos/Wangue.png";
import partnerImage4 from "@/lib/logos/tatu-bg.png";

const PARTNERS = [
  {
    name: "University of Zimbabwe",
    image: partnerImage1,
  },
  {
    name: "Rubiem",
    image: partnerImage2,
  },
  {
    name: "Wangue",
    image: partnerImage3,
  },
  {
    name: "Taty",
    image: partnerImage4,
  },
];

export function PartnerShowcase() {
  return (
    <section className="py-16 bg-transparent">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-8">Our Partners</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          We collaborate with leading technology companies and institutions to
          provide cutting-edge AI education and research opportunities.
        </p>

        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-6 py-4"
            animate={{
              x: [-100, -50, 0, 50, 100, 50, 0, -50, -100],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...PARTNERS, ...PARTNERS].map((partner, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="w-48 h-32 flex items-center justify-center p-6 bg-background/50 backdrop-blur hover:bg-primary/10 transition-colors duration-300">
                  <img
                    src={partner.image}
                    alt={`${partner.name} logo`}
                    className="max-w-full max-h-full object-contain"
                  />
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
