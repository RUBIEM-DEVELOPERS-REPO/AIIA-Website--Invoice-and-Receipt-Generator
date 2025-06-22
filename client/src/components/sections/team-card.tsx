import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

interface TeamCardProps {
  name: string;
  role: string;
  image: string;
  bio: string;
  delay?: number;
}

export default function TeamCard({ name, role, image, bio, delay = 0 }: TeamCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6,
        delay: delay,
        y: {
          duration: 2.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }
      }}
    >
      <Card className="hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-card/80">
        <CardHeader className="text-center">
          <Avatar className="w-24 h-24 mx-auto mb-4">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <h3 className="font-bold text-lg">{name}</h3>
          <p className="text-sm text-muted-foreground">{role}</p>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-center text-muted-foreground">{bio}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}