import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

interface NewsCardProps {
  title: string;
  excerpt: string;
  date: Date;
  image: string;
  url?: string;
  delay?: number;
  size?: "small" | "medium" | "large";
}

export default function NewsCard({ 
  title, 
  excerpt, 
  date, 
  image, 
  url, 
  delay = 0,
  size = "medium" 
}: NewsCardProps) {
  const heights = {
    small: "h-40",
    medium: "h-48",
    large: "h-56"
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: "easeOut"
      }
    },
    hover: {
      y: -5,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={size === "large" ? "md:col-span-2" : ""}
    >
      <Card 
        className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full backdrop-blur-sm bg-card/90" 
        onClick={() => url && window.open(url, '_blank')}
      >
        <div
          className={`${heights[size]} bg-cover bg-center transform transition-transform duration-300 hover:scale-105`}
          style={{ backgroundImage: `url(${image})` }}
        />
        <CardHeader>
          <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
            <time>{formatDistanceToNow(date, { addSuffix: true })}</time>
            {size === "large" && (
              <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                Featured
              </span>
            )}
          </div>
          <CardTitle 
            className={`line-clamp-2 hover:text-primary transition-colors ${
              size === "large" ? "text-2xl" : "text-xl"
            }`}
          >
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-muted-foreground ${
            size === "small" ? "line-clamp-2" : "line-clamp-3"
          }`}>
            {excerpt}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}