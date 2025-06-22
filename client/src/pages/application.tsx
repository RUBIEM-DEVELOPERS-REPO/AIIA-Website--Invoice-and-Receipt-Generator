import { Card, CardContent } from "@/components/ui/card";

export default function Application() {
  return (
    <div className="container py-16">
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-0">
          <iframe 
            src="https://docs.google.com/forms/d/e/1FAIpQLSfxETceYmXvaCDMnH30tJX0TYPrjm5BcO9tw-JNeShLPmk_Xw/viewform?embedded=true" 
            width="100%" 
            height="2020" 
            style={{ border: 'none' }}
            title="AI Training Application Form"
          >
            Loading...
          </iframe>
        </CardContent>
      </Card>
    </div>
  );
}