import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { LottieAnimation } from "@/components/ui/lottie-animation";
import { Link } from "wouter";

interface ProgramCardProps {
  title: string;
  description: string;
  icon: React.ReactNode | any;
  href: string;
}

export default function ProgramCard({ title, description, icon, href }: ProgramCardProps) {
  return (
    <Link href={href}>
      <Card className="group hover:shadow-lg hover:scale-105 transition-all duration-300 h-[400px] flex flex-col cursor-pointer">
      <CardHeader className="flex-grow">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
          {typeof icon === 'object' && 'ip' in icon ? (
            <LottieAnimation animationData={icon} className="w-8 h-8" />
          ) : (
            icon
          )}
        </div>
        <CardTitle className="text-xl mb-4">{title}</CardTitle>
        <CardDescription className="line-clamp-4">{description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <div className="flex items-center text-primary">
          Learn More <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </CardContent>
    </Card>
    </Link>
  );
}
