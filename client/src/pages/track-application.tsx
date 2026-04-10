import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search, Upload, FileText, Image, Music, Video, File,
  CheckCircle2, Clock, XCircle, AlertCircle, Trash2,
  Download, ChevronRight, Calendar, User, Briefcase,
  BookOpen, Shield, RefreshCw, Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode; step: number }> = {
  submitted:        { label: "Submitted",     color: "text-blue-400 bg-blue-400/10 border-blue-400/30",   icon: <CheckCircle2 className="w-4 h-4" />,  step: 1 },
  pending:          { label: "Pending Review",color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30", icon: <Clock className="w-4 h-4" />,        step: 2 },
  under_review:     { label: "Under Review",  color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/30",   icon: <RefreshCw className="w-4 h-4" />,     step: 3 },
  document_uploaded:{ label: "Doc Uploaded",  color: "text-purple-400 bg-purple-400/10 border-purple-400/30", icon: <Upload className="w-4 h-4" />,     step: 0 },
  accepted:         { label: "Accepted",      color: "text-green-400 bg-green-400/10 border-green-400/30", icon: <CheckCircle2 className="w-4 h-4" />, step: 4 },
  rejected:         { label: "Not Accepted",  color: "text-red-400 bg-red-400/10 border-red-400/30",      icon: <XCircle className="w-4 h-4" />,       step: 4 },
};

const PROGRESS_STEPS = ["Submitted", "Pending Review", "Under Review", "Decision Made"];

const FILE_CATEGORIES = ["ID / Passport", "Academic Certificate", "Curriculum Vitae", "Cover Letter", "Proof of Payment", "Reference Letter", "Audio / Video Introduction", "Other"];

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return <Image className="w-5 h-5 text-pink-400" />;
  if (mimeType.startsWith("audio/")) return <Music className="w-5 h-5 text-purple-400" />;
  if (mimeType.startsWith("video/")) return <Video className="w-5 h-5 text-blue-400" />;
  if (mimeType === "application/pdf") return <FileText className="w-5 h-5 text-red-400" />;
  if (mimeType.includes("word")) return <FileText className="w-5 h-5 text-blue-500" />;
  if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) return <FileText className="w-5 h-5 text-green-400" />;
  return <File className="w-5 h-5 text-gray-400" />;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function getStepNumber(status: string): number {
  return STATUS_CONFIG[status]?.step ?? 1;
}

export default function TrackApplication() {
  const [inputRef, setInputRef] = useState("");
  const [activeRef, setActiveRef] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Other");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<{
    application: any;
    documents: any[];
    timeline: any[];
  }>({
    queryKey: ["/api/track", activeRef],
    queryFn: () =>
      fetch(`/api/track/${activeRef}`).then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).message || "Not found");
        return r.json();
      }),
    enabled: !!activeRef,
    retry: false,
  });

  const handleSearch = () => {
    const trimmed = inputRef.trim().toUpperCase();
    if (!trimmed) return;
    setActiveRef(trimmed);
  };

  const deleteMutation = useMutation({
    mutationFn: (docId: number) =>
      apiRequest("DELETE", `/api/track/${activeRef}/documents/${docId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/track", activeRef] });
      toast({ title: "Document removed" });
    },
  });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", selectedCategory);

        try {
          const res = await fetch(`/api/track/${activeRef}/documents`, {
            method: "POST",
            body: formData,
          });
          if (!res.ok) throw new Error((await res.json()).message);
          toast({ title: "Uploaded", description: file.name });
        } catch (e: any) {
          toast({ title: "Upload failed", description: e.message, variant: "destructive" });
        }
      }
      queryClient.invalidateQueries({ queryKey: ["/api/track", activeRef] });
    },
    [activeRef, selectedCategory, queryClient, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: !activeRef,
  });

  const currentStep = data ? getStepNumber(data.application.status) : 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Banner */}
      <div className="relative border-b border-cyan-500/20 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.08),transparent_70%)]" />
        <div className="relative max-w-5xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm mb-4">
            <Shield className="w-3.5 h-3.5" />
            Applicant Portal
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
            Track Your Application
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Enter your unique reference number to view your application status, upload required documents, and follow your journey to enrollment.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

        {/* Search Box */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-400 mb-3">Your reference number was emailed to you when you submitted your application (e.g. AIIA-2026-ABCDEF)</p>
            <div className="flex gap-3">
              <Input
                placeholder="Enter reference number e.g. AIIA-2026-XXXXXX"
                value={inputRef}
                onChange={(e) => setInputRef(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 font-mono uppercase"
              />
              <Button
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 gap-2"
              >
                <Search className="w-4 h-4" />
                {isLoading ? "Searching..." : "Track"}
              </Button>
            </div>
            {error && (
              <p className="mt-3 text-sm text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {(error as Error).message}
              </p>
            )}
          </CardContent>
        </Card>

        <AnimatePresence>
          {data && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Status Header */}
              <Card className="bg-gray-900 border-gray-800 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
                <CardContent className="pt-5">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Reference</p>
                      <p className="font-mono text-lg text-cyan-400 font-semibold">{data.application.referenceNumber}</p>
                      <p className="text-white font-semibold text-xl mt-1">
                        {data.application.firstName} {data.application.lastName}
                      </p>
                      <p className="text-gray-400 text-sm">{data.application.email}</p>
                    </div>
                    <div className="flex flex-col items-start md:items-end gap-2">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${STATUS_CONFIG[data.application.status]?.color || "text-gray-400 bg-gray-800 border-gray-700"}`}>
                        {STATUS_CONFIG[data.application.status]?.icon}
                        {STATUS_CONFIG[data.application.status]?.label || data.application.status}
                      </span>
                      <p className="text-xs text-gray-500 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Applied {format(new Date(data.application.createdAt), "dd MMM yyyy")}
                      </p>
                    </div>
                  </div>

                  {/* Programs */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(data.application.selectedPrograms as any[]).map((p: any, i: number) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-800 text-gray-300 text-xs border border-gray-700">
                        <BookOpen className="w-3 h-3 text-cyan-400" />
                        {p.name}
                      </span>
                    ))}
                  </div>

                  {/* Admin notes */}
                  {data.application.adminNotes && (
                    <div className="mt-4 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20 text-sm text-cyan-200 flex gap-2">
                      <Info className="w-4 h-4 mt-0.5 shrink-0 text-cyan-400" />
                      <span>{data.application.adminNotes}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Progress Bar */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-widest">Application Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    {PROGRESS_STEPS.map((step, i) => {
                      const stepNum = i + 1;
                      const done = currentStep > stepNum || (data.application.status === "accepted" && stepNum === 4);
                      const active = currentStep === stepNum || (stepNum === 4 && ["accepted", "rejected"].includes(data.application.status));
                      const rejected = data.application.status === "rejected" && stepNum === 4;
                      return (
                        <div key={step} className="flex items-center flex-1 last:flex-none">
                          <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                              rejected ? "bg-red-500/20 border-red-500 text-red-400" :
                              done || active ? "bg-cyan-500/20 border-cyan-500 text-cyan-400" :
                              "bg-gray-800 border-gray-700 text-gray-600"
                            }`}>
                              {done && !active ? <CheckCircle2 className="w-4 h-4" /> :
                               rejected ? <XCircle className="w-4 h-4" /> :
                               <span className="text-xs font-bold">{stepNum}</span>}
                            </div>
                            <p className={`text-xs mt-1.5 text-center leading-tight max-w-[70px] ${active || done ? "text-white" : "text-gray-600"}`}>{step}</p>
                          </div>
                          {i < PROGRESS_STEPS.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-1 mb-4 ${currentStep > stepNum ? "bg-cyan-500" : "bg-gray-800"}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Two Column: Upload + Documents */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Upload Zone */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Upload className="w-4 h-4 text-cyan-400" />
                      Upload Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2 items-center">
                      <p className="text-xs text-gray-400">Category:</p>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="flex-1 bg-gray-800 border-gray-700 text-sm h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {FILE_CATEGORIES.map((c) => (
                            <SelectItem key={c} value={c} className="text-gray-200">{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                        isDragActive
                          ? "border-cyan-400 bg-cyan-500/10"
                          : "border-gray-700 hover:border-gray-500 bg-gray-800/40"
                      }`}
                    >
                      <input {...getInputProps()} />
                      <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragActive ? "text-cyan-400" : "text-gray-500"}`} />
                      {isDragActive ? (
                        <p className="text-cyan-400 text-sm font-medium">Drop to upload</p>
                      ) : (
                        <>
                          <p className="text-gray-300 text-sm font-medium">Drag & drop files here</p>
                          <p className="text-gray-500 text-xs mt-1">or click to browse</p>
                          <p className="text-gray-600 text-xs mt-3">All file types accepted · Max 50 MB per file</p>
                        </>
                      )}
                    </div>

                    <div className="grid grid-cols-4 gap-2 mt-1">
                      {[
                        { icon: <FileText className="w-4 h-4 text-red-400" />, label: "PDF" },
                        { icon: <FileText className="w-4 h-4 text-blue-400" />, label: "Word" },
                        { icon: <Image className="w-4 h-4 text-pink-400" />, label: "Images" },
                        { icon: <Music className="w-4 h-4 text-purple-400" />, label: "Audio" },
                        { icon: <Video className="w-4 h-4 text-blue-300" />, label: "Video" },
                        { icon: <FileText className="w-4 h-4 text-green-400" />, label: "Excel" },
                        { icon: <FileText className="w-4 h-4 text-orange-400" />, label: "PPT" },
                        { icon: <File className="w-4 h-4 text-gray-400" />, label: "Other" },
                      ].map(({ icon, label }) => (
                        <div key={label} className="flex flex-col items-center gap-1 p-2 rounded-lg bg-gray-800 text-center">
                          {icon}
                          <span className="text-gray-500 text-xs">{label}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Documents List */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-base">
                      <span className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-cyan-400" />
                        My Documents
                      </span>
                      <Badge variant="outline" className="text-xs border-gray-700 text-gray-400">
                        {data.documents.length} file{data.documents.length !== 1 ? "s" : ""}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data.documents.length === 0 ? (
                      <div className="text-center py-10 text-gray-600">
                        <File className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No documents uploaded yet</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                        {data.documents.map((doc: any) => (
                          <div key={doc.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-800/60 border border-gray-700/50 group hover:border-gray-600 transition-all">
                            <div className="shrink-0">{getFileIcon(doc.mimeType)}</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white truncate">{doc.originalName}</p>
                              <p className="text-xs text-gray-500">
                                {doc.category} · {formatBytes(doc.fileSize)}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <a
                                href={`/api/track/${activeRef}/documents/${doc.id}/download`}
                                download
                                className="p-1.5 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </a>
                              <button
                                onClick={() => deleteMutation.mutate(doc.id)}
                                className="p-1.5 rounded-md hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Timeline */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    Activity Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative pl-6 space-y-5">
                    <div className="absolute left-2 top-1 bottom-1 w-px bg-gray-800" />
                    {[...data.timeline].reverse().map((entry: any, i: number) => {
                      const cfg = STATUS_CONFIG[entry.status];
                      return (
                        <div key={entry.id || i} className="relative">
                          <div className={`absolute -left-6 w-4 h-4 rounded-full border flex items-center justify-center ${cfg?.color || "bg-gray-800 border-gray-600"}`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-current" />
                          </div>
                          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${cfg?.color || "text-gray-400 bg-gray-800 border-gray-700"}`}>
                              {cfg?.label || entry.status}
                            </span>
                            <span className="text-xs text-gray-500">
                              {format(new Date(entry.createdAt), "dd MMM yyyy, HH:mm")}
                            </span>
                          </div>
                          {entry.note && entry.status !== "document_uploaded" && (
                            <p className="mt-1 text-sm text-gray-400 ml-1">{entry.note}</p>
                          )}
                          {entry.status === "document_uploaded" && (
                            <p className="mt-1 text-sm text-gray-400 ml-1 flex items-center gap-1">
                              <Upload className="w-3 h-3 text-purple-400" />
                              {entry.note}
                            </p>
                          )}
                          {entry.updatedBy && entry.updatedBy !== "system" && entry.updatedBy !== "applicant" && (
                            <p className="text-xs text-gray-600 mt-0.5 ml-1 flex items-center gap-1">
                              <User className="w-3 h-3" /> Updated by {entry.updatedBy}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Help */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-400">
                <Info className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <p>
                  For questions about your application, contact us at{" "}
                  <a href="mailto:admin@aiinstituteafrica.com" className="text-cyan-400 hover:underline">admin@aiinstituteafrica.com</a>{" "}
                  quoting your reference number <span className="font-mono text-white">{data.application.referenceNumber}</span>.
                </p>
              </div>

              {/* Refresh */}
              <div className="text-center">
                <Button variant="ghost" onClick={() => refetch()} className="text-gray-500 hover:text-white gap-2 text-sm">
                  <RefreshCw className="w-3.5 h-3.5" />
                  Refresh status
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state – no active search */}
        {!activeRef && !data && (
          <div className="text-center py-16 text-gray-600">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">Enter your reference number above to view your application</p>
          </div>
        )}
      </div>
    </div>
  );
}
