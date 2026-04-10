import { useState, useCallback } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Upload, FileText, AlertCircle, Shield } from "lucide-react";

export default function RefereeUpload() {
  const params = useParams<{ token: string }>();
  const token = params.token;
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data, isLoading, error } = useQuery<{ refereeName: string; applicantName: string; status: string }>({
    queryKey: ["/api/referee", token],
    queryFn: () => fetch(`/api/referee/${token}`).then(async (r) => {
      if (!r.ok) throw new Error((await r.json()).message || "Invalid link");
      return r.json();
    }),
    enabled: !!token,
    retry: false,
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) setSelectedFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false });

  const handleSubmit = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const res = await fetch(`/api/referee/${token}/submit`, { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setSubmitted(true);
    } catch (e: any) {
      toast({ title: "Submission failed", description: e.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm mb-4">
            <Shield className="w-3.5 h-3.5" />
            Secure Reference Portal
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">AI Institute Africa</h1>
          <p className="text-gray-400">Reference Letter Submission</p>
        </div>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            {isLoading && (
              <div className="text-center py-10 text-gray-400">
                <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                Verifying your link...
              </div>
            )}

            {error && (
              <div className="text-center py-10">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <p className="text-red-400 font-medium">Invalid or expired link</p>
                <p className="text-gray-500 text-sm mt-2">This link may have already been used or does not exist.</p>
              </div>
            )}

            {data?.status === "received" && !submitted && (
              <div className="text-center py-10">
                <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <p className="text-green-400 font-medium text-lg">Already submitted</p>
                <p className="text-gray-400 text-sm mt-2">A reference letter has already been received for this request. Thank you!</p>
              </div>
            )}

            {submitted && (
              <div className="text-center py-10">
                <CheckCircle2 className="w-14 h-14 text-green-400 mx-auto mb-4" />
                <p className="text-green-400 font-semibold text-xl mb-2">Submitted successfully!</p>
                <p className="text-gray-400 text-sm">Thank you, {data?.refereeName}. Your reference letter for <strong className="text-white">{data?.applicantName}</strong> has been received. The applicant will be notified.</p>
              </div>
            )}

            {data && data.status !== "received" && !submitted && (
              <div className="space-y-5">
                <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                  <p className="text-sm text-gray-300">
                    Dear <strong className="text-white">{data.refereeName}</strong>, you have been requested to provide a reference letter for <strong className="text-white">{data.applicantName}</strong> who has applied to the AI Institute Africa training program.
                  </p>
                </div>

                {/* Drop zone */}
                <div>
                  <p className="text-sm text-gray-400 mb-2">Upload your reference letter (any format accepted):</p>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragActive ? "border-cyan-400 bg-cyan-500/10" : "border-gray-700 hover:border-gray-500 bg-gray-800/40"}`}
                  >
                    <input {...getInputProps()} />
                    <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragActive ? "text-cyan-400" : "text-gray-500"}`} />
                    {selectedFile ? (
                      <div>
                        <p className="text-cyan-400 font-medium flex items-center justify-center gap-2">
                          <FileText className="w-4 h-4" /> {selectedFile.name}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB — click to change</p>
                      </div>
                    ) : isDragActive ? (
                      <p className="text-cyan-400 text-sm font-medium">Drop your file here</p>
                    ) : (
                      <>
                        <p className="text-gray-300 text-sm font-medium">Drag & drop your reference letter</p>
                        <p className="text-gray-500 text-xs mt-1">or click to browse · PDF, Word, image, or any format · Max 50 MB</p>
                      </>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!selectedFile || uploading}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white gap-2"
                >
                  {uploading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Uploading...</>
                  ) : (
                    <><Upload className="w-4 h-4" /> Submit Reference Letter</>
                  )}
                </Button>

                <p className="text-xs text-gray-600 text-center">
                  This is a secure, one-time submission link. The applicant will not see the content until reviewed by our admissions team.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-700 mt-6">
          © AI Institute Africa · admin@aiinstituteafrica.com
        </p>
      </div>
    </div>
  );
}
