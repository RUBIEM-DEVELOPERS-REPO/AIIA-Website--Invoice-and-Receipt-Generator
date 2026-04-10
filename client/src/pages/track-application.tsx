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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Search, Upload, FileText, Image, Music, Video, File,
  CheckCircle2, Clock, XCircle, AlertCircle, Trash2, Download,
  Calendar, User, Briefcase, BookOpen, Shield, RefreshCw, Info,
  Mail, Sparkles, Users, Award, ChevronRight, Send, Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode; step: number }> = {
  submitted:         { label: "Submitted",         color: "text-blue-400 bg-blue-400/10 border-blue-400/30",    icon: <CheckCircle2 className="w-4 h-4" />, step: 1 },
  pending:           { label: "Pending Review",    color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30", icon: <Clock className="w-4 h-4" />,     step: 2 },
  under_review:      { label: "Under Review",      color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/30",    icon: <RefreshCw className="w-4 h-4" />,    step: 3 },
  accepted:          { label: "Accepted",          color: "text-green-400 bg-green-400/10 border-green-400/30",  icon: <CheckCircle2 className="w-4 h-4" />, step: 4 },
  rejected:          { label: "Not Accepted",      color: "text-red-400 bg-red-400/10 border-red-400/30",       icon: <XCircle className="w-4 h-4" />,      step: 4 },
  document_uploaded: { label: "Document Uploaded", color: "text-purple-400 bg-purple-400/10 border-purple-400/30", icon: <Upload className="w-4 h-4" />,   step: 0 },
  referee_invited:   { label: "Referee Invited",   color: "text-orange-400 bg-orange-400/10 border-orange-400/30", icon: <Mail className="w-4 h-4" />,     step: 0 },
  referee_submitted: { label: "Reference Received",color: "text-teal-400 bg-teal-400/10 border-teal-400/30",    icon: <CheckCircle2 className="w-4 h-4" />, step: 0 },
};

const PROGRESS_STEPS = ["Submitted", "Pending Review", "Under Review", "Decision Made"];

const FILE_CATEGORIES = [
  "ID / Passport", "Academic Certificate", "Curriculum Vitae", "Cover Letter",
  "Proof of Payment", "Reference Letter", "Audio / Video Introduction", "Other",
];

const CHECKLIST_ITEMS = [
  { key: "submitted",    label: "Application submitted",             required: true,  cat: null },
  { key: "id",           label: "ID / Passport uploaded",            required: true,  cat: "ID / Passport" },
  { key: "cert",         label: "Academic Certificate uploaded",     required: true,  cat: "Academic Certificate" },
  { key: "cv",           label: "CV / Resume uploaded",              required: true,  cat: "Curriculum Vitae" },
  { key: "cover",        label: "Cover Letter uploaded",             required: false, cat: "Cover Letter" },
  { key: "payment",      label: "Proof of Payment uploaded",         required: false, cat: "Proof of Payment" },
  { key: "reference",    label: "Reference letter requested",        required: false, cat: "Reference Letter" },
  { key: "video",        label: "Video / Audio introduction (optional)", required: false, cat: "Audio / Video Introduction" },
];

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

export default function TrackApplication() {
  const [inputRef, setInputRef] = useState("");
  const [activeRef, setActiveRef] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Other");
  const [aiResults, setAiResults] = useState<Record<number, string>>({});
  const [analyzingDoc, setAnalyzingDoc] = useState<number | null>(null);
  const [refereeName, setRefereeName] = useState("");
  const [refereeEmail, setRefereeEmail] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<{
    application: any; documents: any[]; timeline: any[];
  }>({
    queryKey: ["/api/track", activeRef],
    queryFn: () => fetch(`/api/track/${activeRef}`).then(async (r) => {
      if (!r.ok) throw new Error((await r.json()).message || "Not found");
      return r.json();
    }),
    enabled: !!activeRef,
    retry: false,
  });

  const { data: refereeData } = useQuery<any[]>({
    queryKey: ["/api/track", activeRef, "referee-requests"],
    queryFn: () => fetch(`/api/track/${activeRef}/referee-requests`).then(r => r.json()),
    enabled: !!activeRef && !!data,
  });

  const { data: cohortData } = useQuery<{ cohort: any[]; total: number }>({
    queryKey: ["/api/track", activeRef, "cohort"],
    queryFn: () => fetch(`/api/track/${activeRef}/cohort`).then(async r => {
      if (!r.ok) return null;
      return r.json();
    }),
    enabled: !!activeRef && data?.application?.status === "accepted",
    retry: false,
  });

  const deleteMutation = useMutation({
    mutationFn: (docId: number) => apiRequest("DELETE", `/api/track/${activeRef}/documents/${docId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/track", activeRef] });
      toast({ title: "Document removed" });
    },
  });

  const refereeMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/track/${activeRef}/referee-request`, { refereeName, refereeEmail }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/track", activeRef, "referee-requests"] });
      setRefereeName(""); setRefereeEmail("");
      toast({ title: "Invitation sent!", description: `${refereeEmail} will receive an email with an upload link.` });
    },
    onError: (e: any) => toast({ title: "Failed to send", description: e.message, variant: "destructive" }),
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", selectedCategory);
      try {
        const res = await fetch(`/api/track/${activeRef}/documents`, { method: "POST", body: formData });
        if (!res.ok) throw new Error((await res.json()).message);
        toast({ title: "Uploaded", description: file.name });
      } catch (e: any) {
        toast({ title: "Upload failed", description: e.message, variant: "destructive" });
      }
    }
    queryClient.invalidateQueries({ queryKey: ["/api/track", activeRef] });
  }, [activeRef, selectedCategory, queryClient, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, disabled: !activeRef });

  const analyzeDocument = async (docId: number) => {
    setAnalyzingDoc(docId);
    try {
      const res = await fetch(`/api/track/${activeRef}/documents/${docId}/analyze`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setAiResults(prev => ({ ...prev, [docId]: json.analysis }));
    } catch (e: any) {
      toast({ title: "Analysis failed", description: e.message, variant: "destructive" });
    } finally {
      setAnalyzingDoc(null);
    }
  };

  // Compute checklist
  const docs = data?.documents || [];
  const refs = refereeData || [];
  const checklistStatus = CHECKLIST_ITEMS.map(item => {
    if (item.key === "submitted") return { ...item, done: true };
    if (item.key === "reference") return { ...item, done: refs.length > 0 };
    if (item.cat) return { ...item, done: docs.some((d: any) => d.category === item.cat) };
    return { ...item, done: false };
  });
  const requiredDone = checklistStatus.filter(i => i.required && i.done).length;
  const requiredTotal = checklistStatus.filter(i => i.required).length;
  const completionPct = Math.round((requiredDone / requiredTotal) * 100);

  const currentStep = data ? (STATUS_CONFIG[data.application.status]?.step || 1) : 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <div className="relative border-b border-cyan-500/20 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.08),transparent_70%)]" />
        <div className="relative max-w-5xl mx-auto px-4 py-14 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm mb-4">
            <Shield className="w-3.5 h-3.5" /> Applicant Portal
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
            Track Your Application
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">
            Enter your reference number to view your application status, upload documents, and manage your full profile.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* Search */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="pt-5">
            <p className="text-xs text-gray-500 mb-2">Reference number was emailed when you applied (e.g. AIIA-2026-ABCDEF)</p>
            <div className="flex gap-3">
              <Input
                placeholder="AIIA-2026-XXXXXX"
                value={inputRef}
                onChange={e => setInputRef(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === "Enter" && setActiveRef(inputRef.trim())}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600 font-mono uppercase"
              />
              <Button onClick={() => setActiveRef(inputRef.trim())} disabled={isLoading} className="bg-cyan-600 hover:bg-cyan-500 gap-2 px-6">
                <Search className="w-4 h-4" />
                {isLoading ? "Searching..." : "Track"}
              </Button>
            </div>
            {error && <p className="mt-2 text-sm text-red-400 flex items-center gap-2"><AlertCircle className="w-4 h-4" />{(error as Error).message}</p>}
          </CardContent>
        </Card>

        <AnimatePresence>
          {data && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">

              {/* Status Header */}
              <Card className="bg-gray-900 border-gray-800 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
                <CardContent className="pt-5">
                  <div className="flex flex-col md:flex-row md:justify-between gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-widest">Reference</p>
                      <p className="font-mono text-lg text-cyan-400 font-semibold">{data.application.referenceNumber}</p>
                      <p className="text-white font-semibold text-xl mt-0.5">{data.application.firstName} {data.application.lastName}</p>
                      <p className="text-gray-400 text-sm">{data.application.email}</p>
                    </div>
                    <div className="flex flex-col items-start md:items-end gap-2">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${STATUS_CONFIG[data.application.status]?.color || "text-gray-400 bg-gray-800 border-gray-700"}`}>
                        {STATUS_CONFIG[data.application.status]?.icon}
                        {STATUS_CONFIG[data.application.status]?.label || data.application.status}
                      </span>
                      <p className="text-xs text-gray-500 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Applied {format(new Date(data.application.createdAt), "dd MMM yyyy")}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(data.application.selectedPrograms as any[]).map((p: any, i: number) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-800 text-gray-300 text-xs border border-gray-700">
                        <BookOpen className="w-3 h-3 text-cyan-400" />{p.name}
                      </span>
                    ))}
                  </div>
                  {data.application.adminNotes && (
                    <div className="mt-3 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20 text-sm text-cyan-200 flex gap-2">
                      <Info className="w-4 h-4 mt-0.5 shrink-0 text-cyan-400" />
                      {data.application.adminNotes}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Progress Bar */}
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="pt-5">
                  <div className="flex items-center">
                    {PROGRESS_STEPS.map((step, i) => {
                      const num = i + 1;
                      const done = currentStep > num || (data.application.status === "accepted" && num === 4);
                      const active = currentStep === num || (num === 4 && ["accepted","rejected"].includes(data.application.status));
                      const rejected = data.application.status === "rejected" && num === 4;
                      return (
                        <div key={step} className="flex items-center flex-1 last:flex-none">
                          <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${rejected ? "bg-red-500/20 border-red-500 text-red-400" : done || active ? "bg-cyan-500/20 border-cyan-500 text-cyan-400" : "bg-gray-800 border-gray-700 text-gray-600"}`}>
                              {done && !active ? <CheckCircle2 className="w-4 h-4" /> : rejected ? <XCircle className="w-4 h-4" /> : <span className="text-xs font-bold">{num}</span>}
                            </div>
                            <p className={`text-xs mt-1.5 text-center leading-tight max-w-[72px] ${active || done ? "text-white" : "text-gray-600"}`}>{step}</p>
                          </div>
                          {i < PROGRESS_STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-1 mb-5 ${currentStep > num ? "bg-cyan-500" : "bg-gray-800"}`} />}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Tabs */}
              <Tabs defaultValue="documents" className="w-full">
                <TabsList className="bg-gray-900 border border-gray-800 w-full grid grid-cols-4 h-auto">
                  {[
                    { value: "documents", label: "Documents", icon: <Briefcase className="w-3.5 h-3.5" /> },
                    { value: "checklist", label: "Checklist", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
                    { value: "references", label: "References", icon: <Mail className="w-3.5 h-3.5" /> },
                    { value: "timeline",  label: "Timeline",   icon: <Clock className="w-3.5 h-3.5" /> },
                  ].map(tab => (
                    <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-1.5 text-xs py-2.5 data-[state=active]:bg-gray-800 data-[state=active]:text-cyan-400">
                      {tab.icon}{tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* ── DOCUMENTS TAB ── */}
                <TabsContent value="documents" className="mt-4 grid md:grid-cols-2 gap-5">
                  {/* Upload */}
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Upload className="w-4 h-4 text-cyan-400" />Upload a File</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-400 whitespace-nowrap">Category:</p>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="flex-1 bg-gray-800 border-gray-700 text-sm h-8"><SelectValue /></SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            {FILE_CATEGORIES.map(c => <SelectItem key={c} value={c} className="text-gray-200">{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-7 text-center cursor-pointer transition-all ${isDragActive ? "border-cyan-400 bg-cyan-500/10" : "border-gray-700 hover:border-gray-600 bg-gray-800/40"}`}>
                        <input {...getInputProps()} />
                        <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragActive ? "text-cyan-400" : "text-gray-500"}`} />
                        {isDragActive ? <p className="text-cyan-400 text-sm font-medium">Drop to upload</p> : (
                          <><p className="text-gray-300 text-sm font-medium">Drag & drop or click to browse</p><p className="text-gray-600 text-xs mt-1">All file types · Max 50 MB</p></>
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[{icon:<FileText className="w-3.5 h-3.5 text-red-400"/>,l:"PDF"},{icon:<FileText className="w-3.5 h-3.5 text-blue-400"/>,l:"Word"},{icon:<Image className="w-3.5 h-3.5 text-pink-400"/>,l:"Images"},{icon:<Music className="w-3.5 h-3.5 text-purple-400"/>,l:"Audio"},{icon:<Video className="w-3.5 h-3.5 text-blue-300"/>,l:"Video"},{icon:<FileText className="w-3.5 h-3.5 text-green-400"/>,l:"Excel"},{icon:<FileText className="w-3.5 h-3.5 text-orange-400"/>,l:"PPT"},{icon:<File className="w-3.5 h-3.5 text-gray-400"/>,l:"Other"}].map(({icon,l})=>(
                          <div key={l} className="flex flex-col items-center gap-0.5 p-1.5 rounded bg-gray-800 text-center">{icon}<span className="text-gray-600 text-xs">{l}</span></div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Documents List */}
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center justify-between">
                        <span className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-cyan-400" />My Documents</span>
                        <Badge variant="outline" className="text-xs border-gray-700 text-gray-400">{docs.length} file{docs.length !== 1 ? "s" : ""}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {docs.length === 0 ? (
                        <div className="text-center py-10 text-gray-600"><File className="w-10 h-10 mx-auto mb-2 opacity-20" /><p className="text-sm">No documents yet</p></div>
                      ) : (
                        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                          {docs.map((doc: any) => (
                            <div key={doc.id} className="rounded-lg bg-gray-800/50 border border-gray-700/50 overflow-hidden">
                              <div className="flex items-center gap-3 p-2.5 group">
                                <div className="shrink-0">{getFileIcon(doc.mimeType)}</div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-white truncate">{doc.originalName}</p>
                                  <p className="text-xs text-gray-500">{doc.category} · {formatBytes(doc.fileSize)}</p>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => analyzeDocument(doc.id)} disabled={analyzingDoc === doc.id} title="AI check" className="p-1.5 rounded hover:bg-purple-500/20 text-gray-400 hover:text-purple-400 transition-colors">
                                    {analyzingDoc === doc.id ? <div className="w-3.5 h-3.5 border border-purple-400 border-t-transparent rounded-full animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                                  </button>
                                  <a href={`/api/track/${activeRef}/documents/${doc.id}/download`} download className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"><Download className="w-3.5 h-3.5" /></a>
                                  <button onClick={() => deleteMutation.mutate(doc.id)} className="p-1.5 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                              </div>
                              {aiResults[doc.id] && (
                                <div className="px-3 pb-3">
                                  <div className={`text-xs p-2.5 rounded-lg ${aiResults[doc.id].startsWith("✓") ? "bg-green-500/10 border border-green-500/20 text-green-300" : "bg-yellow-500/10 border border-yellow-500/20 text-yellow-300"}`}>
                                    <p className="font-medium mb-1 flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI Assessment</p>
                                    {aiResults[doc.id]}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* ── CHECKLIST TAB ── */}
                <TabsContent value="checklist" className="mt-4">
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between text-base">
                        <span className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400" />Application Completeness</span>
                        <span className="text-sm font-normal text-gray-400">{requiredDone}/{requiredTotal} required items</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      {/* Score ring */}
                      <div className="flex items-center gap-6 p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                        <div className="relative w-20 h-20 shrink-0">
                          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                            <circle cx="40" cy="40" r="34" fill="none" stroke="#1f2937" strokeWidth="8" />
                            <circle cx="40" cy="40" r="34" fill="none" stroke={completionPct === 100 ? "#22c55e" : "#06b6d4"} strokeWidth="8" strokeLinecap="round"
                              strokeDasharray={`${2 * Math.PI * 34}`}
                              strokeDashoffset={`${2 * Math.PI * 34 * (1 - completionPct / 100)}`}
                              className="transition-all duration-700" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className={`text-lg font-bold ${completionPct === 100 ? "text-green-400" : "text-cyan-400"}`}>{completionPct}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-white font-semibold text-lg">
                            {completionPct === 100 ? "Application Complete!" : completionPct >= 60 ? "Almost there!" : "Keep going!"}
                          </p>
                          <p className="text-gray-400 text-sm mt-0.5">
                            {completionPct === 100 ? "All required items have been submitted. Great work!" : `Complete the remaining required items to strengthen your application.`}
                          </p>
                          <div className="mt-2"><Progress value={completionPct} className="h-2 bg-gray-700" /></div>
                        </div>
                      </div>

                      {/* Checklist items */}
                      <div className="space-y-2">
                        {checklistStatus.map((item) => (
                          <div key={item.key} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${item.done ? "bg-green-500/5 border-green-500/20" : item.required ? "bg-gray-800/50 border-gray-700/50" : "bg-gray-800/30 border-gray-800"}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 ${item.done ? "bg-green-500/20 border-green-500 text-green-400" : item.required ? "bg-gray-800 border-gray-600 text-gray-600" : "bg-gray-800 border-gray-700 text-gray-700"}`}>
                              {item.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm ${item.done ? "text-white" : item.required ? "text-gray-300" : "text-gray-500"}`}>{item.label}</p>
                            </div>
                            <div className="shrink-0">
                              {item.required ? (
                                <Badge variant="outline" className={`text-xs ${item.done ? "border-green-500/30 text-green-400" : "border-red-500/30 text-red-400"}`}>
                                  {item.done ? "Done" : "Required"}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs border-gray-700 text-gray-500">Optional</Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {completionPct < 100 && (
                        <p className="text-xs text-gray-500 flex items-start gap-2">
                          <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-cyan-400" />
                          Upload missing documents in the <strong className="text-gray-400">Documents</strong> tab. Optional items strengthen your application but are not mandatory.
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Cohort — only for accepted */}
                  {data.application.status === "accepted" && (
                    <Card className="bg-gray-900 border-gray-800 mt-5">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Users className="w-4 h-4 text-cyan-400" />Your Cohort
                          {cohortData && <Badge variant="outline" className="text-xs border-gray-700 text-gray-400">{cohortData.total} fellow{cohortData.total !== 1 ? "s" : ""}</Badge>}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {!cohortData ? (
                          <div className="text-center py-6 text-gray-600 text-sm">Loading cohort...</div>
                        ) : cohortData.total === 0 ? (
                          <div className="text-center py-6">
                            <Award className="w-10 h-10 mx-auto mb-2 text-yellow-400 opacity-60" />
                            <p className="text-gray-400 text-sm">You are the first accepted applicant in your program! Your cohort will grow soon.</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <p className="text-sm text-gray-400">Meet your fellow accepted applicants in the same program(s):</p>
                            <div className="space-y-2 max-h-72 overflow-y-auto">
                              {cohortData.cohort.map((member: any, i: number) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
                                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                    {member.initial}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-300 font-medium">{member.initial} — {member.trainingType === "corporate" ? "Corporate Enrollment" : "Individual Enrollment"}</p>
                                    <p className="text-xs text-gray-500 truncate">{member.programs.join(", ")}</p>
                                  </div>
                                  <p className="text-xs text-gray-600 shrink-0">{member.enrolledMonth}</p>
                                </div>
                              ))}
                            </div>
                            <p className="text-xs text-gray-600 flex items-center gap-1.5"><Shield className="w-3 h-3" />Names are anonymised to protect applicant privacy.</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* ── REFERENCES TAB ── */}
                <TabsContent value="references" className="mt-4">
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Mail className="w-4 h-4 text-cyan-400" />Reference Letters
                        <Badge variant="outline" className="text-xs border-gray-700 text-gray-400 font-normal">Optional</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <p className="text-sm text-gray-400">Invite a referee to submit a reference letter directly. They'll receive a private email link and upload without you seeing the content until reviewed.</p>

                      {/* Invite form */}
                      <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700 space-y-3">
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Invite a Referee</p>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">Full Name</label>
                            <Input value={refereeName} onChange={e => setRefereeName(e.target.value)} placeholder="Dr. Jane Smith" className="bg-gray-900 border-gray-700 text-sm h-9" />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">Email Address</label>
                            <Input value={refereeEmail} onChange={e => setRefereeEmail(e.target.value)} placeholder="referee@institution.com" type="email" className="bg-gray-900 border-gray-700 text-sm h-9" />
                          </div>
                        </div>
                        <Button onClick={() => refereeMutation.mutate()} disabled={!refereeName || !refereeEmail || refereeMutation.isPending} className="bg-cyan-600 hover:bg-cyan-500 gap-2 text-sm">
                          <Send className="w-3.5 h-3.5" />
                          {refereeMutation.isPending ? "Sending..." : "Send Invitation"}
                        </Button>
                      </div>

                      {/* Existing requests */}
                      {refs.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Sent Invitations</p>
                          {refs.map((req: any) => (
                            <div key={req.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${req.status === "received" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                                {req.status === "received" ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-white">{req.refereeName}</p>
                                <p className="text-xs text-gray-500">{req.refereeEmail}</p>
                              </div>
                              <Badge variant="outline" className={`text-xs ${req.status === "received" ? "border-green-500/30 text-green-400" : "border-yellow-500/30 text-yellow-400"}`}>
                                {req.status === "received" ? "Received" : "Pending"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}

                      {refs.length === 0 && (
                        <div className="text-center py-8 text-gray-600">
                          <Mail className="w-10 h-10 mx-auto mb-2 opacity-20" />
                          <p className="text-sm">No referee invitations sent yet</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* ── TIMELINE TAB ── */}
                <TabsContent value="timeline" className="mt-4">
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Clock className="w-4 h-4 text-cyan-400" />Activity Timeline</CardTitle></CardHeader>
                    <CardContent>
                      <div className="relative pl-6 space-y-5">
                        <div className="absolute left-2 top-1 bottom-1 w-px bg-gray-800" />
                        {[...data.timeline].reverse().map((entry: any, i: number) => {
                          const cfg = STATUS_CONFIG[entry.status];
                          return (
                            <div key={entry.id || i} className="relative">
                              <div className={`absolute -left-6 w-4 h-4 rounded-full border-2 flex items-center justify-center bg-gray-900 ${cfg?.color?.includes("text-") ? cfg.color.split(" ")[2] || "border-gray-600" : "border-gray-600"}`}>
                                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${cfg?.color || "text-gray-400 bg-gray-800 border-gray-700"}`}>
                                  {cfg?.label || entry.status}
                                </span>
                                <span className="text-xs text-gray-500">{format(new Date(entry.createdAt), "dd MMM yyyy, HH:mm")}</span>
                              </div>
                              {entry.note && !["document_uploaded","referee_invited","referee_submitted"].includes(entry.status) && (
                                <p className="mt-1 text-sm text-gray-400 ml-1">{entry.note}</p>
                              )}
                              {["document_uploaded","referee_invited","referee_submitted"].includes(entry.status) && (
                                <p className="mt-1 text-xs text-gray-500 ml-1 flex items-center gap-1">
                                  {entry.status === "document_uploaded" && <Upload className="w-3 h-3 text-purple-400" />}
                                  {entry.status === "referee_invited" && <Mail className="w-3 h-3 text-orange-400" />}
                                  {entry.status === "referee_submitted" && <CheckCircle2 className="w-3 h-3 text-teal-400" />}
                                  {entry.note}
                                </p>
                              )}
                              {entry.updatedBy && !["system","applicant","referee"].includes(entry.updatedBy) && (
                                <p className="text-xs text-gray-600 ml-1 flex items-center gap-1 mt-0.5"><User className="w-3 h-3" />Updated by {entry.updatedBy}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Footer help & refresh */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-400">
                <p className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  Questions? Email <a href="mailto:admin@aiinstituteafrica.com" className="text-cyan-400 hover:underline">admin@aiinstituteafrica.com</a> with reference <span className="font-mono text-white">{data.application.referenceNumber}</span>
                </p>
                <Button variant="ghost" onClick={() => refetch()} className="text-gray-500 hover:text-white gap-2 text-xs shrink-0">
                  <RefreshCw className="w-3.5 h-3.5" />Refresh
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!activeRef && (
          <div className="text-center py-16 text-gray-700">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">Enter your reference number above to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
