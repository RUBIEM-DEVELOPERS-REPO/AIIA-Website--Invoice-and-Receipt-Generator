import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type EmailResults = {
  total: number;
  successful: number;
  failed: number;
  errors: string[];
};

export default function MarketingEmailPage() {
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [emailResults, setEmailResults] = useState<EmailResults | null>(null);

  const sendEmailMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/marketing-email", {
        subject,
        message,
      });
      return res.json();
    },
    onSuccess: (data) => {
      setEmailResults(data.results);
      toast({
        title: "Success",
        description: data.message,
      });
      setSubject("");
      setMessage("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSendEmail = () => {
    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both subject and message fields.",
        variant: "destructive",
      });
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmSendEmail = () => {
    setShowConfirmDialog(false);
    sendEmailMutation.mutate();
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Mail className="h-8 w-8" />
              Marketing Emails
            </h2>
            <p className="text-muted-foreground mt-2">
              Send marketing emails to all registered customers
            </p>
          </div>
          <Link href="/admin/dashboard">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Compose Email</CardTitle>
            <CardDescription>
              This email will be sent to all active registered customers. Use {'{name}'} to personalize with the customer's name.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Email Subject
              </label>
              <Input
                id="subject"
                placeholder="Enter email subject..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={sendEmailMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Email Message
              </label>
              <Textarea
                id="message"
                placeholder="Enter your message here... You can use {{name}} to personalize with customer names."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={12}
                disabled={sendEmailMutation.isPending}
              />
              <p className="text-xs text-muted-foreground">
                Tip: Use {'{name}'} in your message to automatically insert each customer's name
              </p>
            </div>

            <div className="pt-4">
              <Button 
                onClick={handleSendEmail} 
                className="w-full sm:w-auto"
                disabled={sendEmailMutation.isPending}
              >
                {sendEmailMutation.isPending ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send to All Customers
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {emailResults && (
          <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
            <CardHeader>
              <CardTitle className="text-green-700 dark:text-green-400">
                Email Sending Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Total Recipients:</strong> {emailResults.total}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  <strong>Successfully Sent:</strong> {emailResults.successful}
                </p>
                {emailResults.failed > 0 && (
                  <>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      <strong>Failed:</strong> {emailResults.failed}
                    </p>
                    {emailResults.errors.length > 0 && (
                      <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 rounded-md">
                        <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                          Error Details:
                        </p>
                        <ul className="text-xs text-red-700 dark:text-red-300 space-y-1">
                          {emailResults.errors.slice(0, 5).map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                          {emailResults.errors.length > 5 && (
                            <li>• ... and {emailResults.errors.length - 5} more errors</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Email Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-6 bg-muted/50">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">Subject:</p>
                <p className="font-semibold">{subject || "Your subject will appear here..."}</p>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-2">Message:</p>
                <div className="whitespace-pre-wrap">
                  {message ? (
                    <div>
                      <p className="font-medium mb-2">Hello [Customer Name],</p>
                      <p>{message.replace(/{name}/g, '[Customer Name]')}</p>
                      <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
                        <p>Best regards,</p>
                        <p>AI Institute Africa Team</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Your message will appear here...</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Send to All Customers</AlertDialogTitle>
            <AlertDialogDescription>
              This will send the marketing email to all active registered customers. 
              Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSendEmail}>
              Yes, Send Email
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
