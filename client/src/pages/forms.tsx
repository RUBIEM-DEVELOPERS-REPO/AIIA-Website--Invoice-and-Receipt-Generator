import { Card } from "@/components/ui/card";

export default function FormsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">
        Please Fill Out The Following Form
      </h1>
      <Card className="p-4 flex justify-center">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSfxETceYmXvaCDMnH30tJX0TYPrjm5BcO9tw-JNeShLPmk_Xw/viewform?embedded=true"
          width="100%"
          height="2020"
          frameBorder="0"
          className="w-full max-w-4xl m-0"
        >
          Loading…
        </iframe>
      </Card>
    </div>
  );
}
