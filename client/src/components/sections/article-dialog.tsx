import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { LottieAnimation } from "@/components/ui/lottie-animation";
import animationData5 from "@/lib/lotties/locked.json";
import animationData3 from "@/lib/lotties/AI.json";

interface ArticleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  author: string;
  content: string;
  requirement?: string;
  isLoggedIn?: boolean;
}

const ArticleDialog: React.FC<ArticleDialogProps> = ({
  isOpen,
  onClose,
  title,
  author,
  content,
  requirement = "Free",
  isLoggedIn = false,
}) => {
  const isMembershipRequired = requirement === "Membership";
  const shouldBlur = isMembershipRequired && !isLoggedIn;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] w-[95vw] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <p className="text-sm text-muted-foreground">By {author}</p>
        </DialogHeader>
        {shouldBlur ? (
          <div className="mt-4 flex flex-col items-center justify-center min-h-[200px] bg-muted/30 rounded-lg p-8">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6">
                <LottieAnimation
                  animationData={animationData5}
                  className="w-full h-full"
                />
              </div>
              <h3 className="text-xl font-bold mb-4">Membership Required</h3>
              <p className="mb-4">
                Please login or become a member to read this article
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild className="w-32 h-10">
                  <Link href="/membership">Join Membership</Link>
                </Button>
                <LottieAnimation
                  animationData={animationData3}
                  className="w-8 h-4"
                />
                <Button
                  // variant="outline"
                  onClick={onClose}
                  asChild
                  className="w-32 h-10"
                >
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onClose();
                      // Trigger login dialog through DOM event
                      (document.querySelector('[aria-label="Login"]') as HTMLElement)?.click();
                    }}
                  >
                    Login
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 prose dark:prose-invert max-w-none">
            {content.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-4 text-lg">
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ArticleDialog;
