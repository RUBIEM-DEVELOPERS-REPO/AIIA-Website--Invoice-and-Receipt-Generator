import { motion } from "framer-motion";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Users, 
  Code, 
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink
} from "lucide-react";

interface ProjectCardProps {
  id: number;
  title: string;
  description: string;
  status: string;
  category: string;
  startDate: string;
  endDate: string;
  progress: number;
  team: string[];
  technologies: string[];
  impact: string;
  image: string;
  externalLink?: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Completed":
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case "In Progress":
      return <Clock className="w-4 h-4 text-blue-600" />;
    case "Active":
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case "Planning":
      return <AlertCircle className="w-4 h-4 text-orange-600" />;
    case "Pilot Phase":
      return <Target className="w-4 h-4 text-purple-600" />;
    default:
      return <Clock className="w-4 h-4 text-gray-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "In Progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "Active":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "Planning":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    case "Pilot Phase":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Healthcare":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "Agriculture":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "FinTech":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "Education":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "Climate":
      return "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200";
    case "Smart Cities":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

const getProjectRoute = (id: number, title: string) => {
  // No dedicated project pages currently
  return null;
};

export default function ProjectCard({
  id,
  title,
  description,
  status,
  category,
  startDate,
  endDate,
  progress,
  team,
  technologies,
  impact,
  image,
  externalLink
}: ProjectCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const hoverVariants = {
    hover: {
      scale: 1.03,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="h-full"
    >
      <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
        {/* Project Image */}
        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            variants={hoverVariants}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Status and Category Badges */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <Badge className={`${getStatusColor(status)} flex items-center gap-1`}>
              {getStatusIcon(status)}
              {status}
            </Badge>
            <Badge className={getCategoryColor(category)}>
              {category}
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold leading-tight">
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
            {description}
          </p>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Progress</span>
              <span className="font-semibold">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Project Timeline */}
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>
              {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
            </span>
          </div>

          {/* Team */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <Users className="w-3 h-3" />
              <span>Team ({team.length})</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {team.slice(0, 2).map((member, index) => (
                <Badge key={index} variant="outline" className="text-xs px-2 py-0">
                  {member}
                </Badge>
              ))}
              {team.length > 2 && (
                <Badge variant="outline" className="text-xs px-2 py-0">
                  +{team.length - 2} more
                </Badge>
              )}
            </div>
          </div>

          {/* Technologies */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <Code className="w-3 h-3" />
              <span>Technologies</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {technologies.slice(0, 3).map((tech, index) => (
                <Badge key={index} variant="secondary" className="text-xs px-2 py-0">
                  {tech}
                </Badge>
              ))}
              {technologies.length > 3 && (
                <Badge variant="secondary" className="text-xs px-2 py-0">
                  +{technologies.length - 3}
                </Badge>
              )}
            </div>
          </div>

          {/* Impact */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <Target className="w-3 h-3" />
              <span>Impact</span>
            </div>
            <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">
              {impact}
            </p>
          </div>

          {/* Action Buttons */}
          {externalLink && (
            <div className="pt-2">
              <a href={externalLink} target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
                  <ExternalLink className="w-3 h-3 mr-2" />
                  Try Live Demo
                </Button>
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}