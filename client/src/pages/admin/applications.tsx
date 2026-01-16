import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Search, 
  ArrowLeft, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText,
  Download,
  User,
  Mail,
  GraduationCap,
  Calendar
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { X } from "lucide-react";

type Program = {
  id: string;
  name: string;
  category?: string;
};

type Application = {
  id: number;
  referenceNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  graduateStatus: "graduate" | "non_graduate";
  selectedPrograms: Program[];
  documentPath: string | null;
  status: "pending" | "under_review" | "accepted" | "rejected";
  adminNotes: string | null;
  reviewedAt: string | null;
  emailSent: boolean;
  createdAt: string;
  updatedAt: string;
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  under_review: "bg-blue-100 text-blue-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  under_review: "Under Review",
  accepted: "Accepted",
  rejected: "Rejected",
};

export default function ApplicationsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [newStatus, setNewStatus] = useState<string>("");

  const { data: applications = [], isLoading } = useQuery<Application[]>({
    queryKey: ["/api/admin/program-applications"],
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      status,
      adminNotes,
    }: {
      id: number;
      status: string;
      adminNotes: string;
    }) => {
      const res = await apiRequest(
        "PATCH",
        `/api/admin/program-applications/${id}`,
        { status, adminNotes }
      );
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/program-applications"] });
      setReviewDialogOpen(false);
      setSelectedApplication(null);
      const emailSent = variables.status === "accepted" || variables.status === "rejected";
      toast({
        title: "Success",
        description: emailSent 
          ? "Application status updated. Email notification sent to applicant."
          : "Application status updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const openViewDialog = (application: Application) => {
    setSelectedApplication(application);
    setViewDialogOpen(true);
  };

  const openReviewDialog = (application: Application) => {
    setSelectedApplication(application);
    setAdminNotes(application.adminNotes || "");
    setNewStatus(application.status);
    setReviewDialogOpen(true);
  };

  const handleStatusUpdate = () => {
    if (!selectedApplication || !newStatus) return;
    updateMutation.mutate({
      id: selectedApplication.id,
      status: newStatus,
      adminNotes,
    });
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold tracking-tight">Program Applications</h2>
          <Link href="/admin/dashboard">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[300px]"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Total: {filteredApplications.length} applications</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Programs</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    No applications found
                  </TableCell>
                </TableRow>
              ) : (
                filteredApplications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-mono text-sm">{app.referenceNumber}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {app.firstName} {app.lastName}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{app.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {app.selectedPrograms.slice(0, 2).map((p, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {p.name.length > 20 ? p.name.substring(0, 20) + "..." : p.name}
                          </Badge>
                        ))}
                        {app.selectedPrograms.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{app.selectedPrograms.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[app.status]}>
                        {statusLabels[app.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(app.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openViewDialog(app)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openReviewDialog(app)}
                        >
                          Review
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* View Application Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100">
            <X className="h-5 w-5" />
          </DialogClose>
          <DialogHeader>
            <DialogTitle className="text-xl">Application Details</DialogTitle>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Reference Number</label>
                  <p className="font-mono">{selectedApplication.referenceNumber}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Badge className={statusColors[selectedApplication.status]}>
                    {statusLabels[selectedApplication.status]}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" /> Applicant Name
                  </label>
                  <p>{selectedApplication.firstName} {selectedApplication.lastName}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Email
                  </label>
                  <p>{selectedApplication.email}</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" /> Graduate Status
                </label>
                <Badge variant="outline">
                  {selectedApplication.graduateStatus === "graduate" ? "Graduate" : "Non-Graduate"}
                </Badge>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Selected Programs</label>
                <div className="space-y-2">
                  {selectedApplication.selectedPrograms.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                      <FileText className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">{p.name}</p>
                        {p.category && <p className="text-sm text-muted-foreground">{p.category}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedApplication.documentPath && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Uploaded Document</label>
                  <a
                    href={selectedApplication.documentPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <Download className="h-4 w-4" />
                    View Document
                  </a>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Submitted
                  </label>
                  <p className="text-sm">{formatDate(selectedApplication.createdAt)}</p>
                </div>
                {selectedApplication.reviewedAt && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">Reviewed</label>
                    <p className="text-sm">{formatDate(selectedApplication.reviewedAt)}</p>
                  </div>
                )}
              </div>

              {selectedApplication.adminNotes && (
                <div className="space-y-1 pt-4 border-t">
                  <label className="text-sm font-medium text-muted-foreground">Admin Notes</label>
                  <p className="text-sm bg-muted p-3 rounded-md">{selectedApplication.adminNotes}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setViewDialogOpen(false);
              if (selectedApplication) openReviewDialog(selectedApplication);
            }}>
              Review Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Application Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100">
            <X className="h-5 w-5" />
          </DialogClose>
          <DialogHeader>
            <DialogTitle className="text-xl">Review Application</DialogTitle>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-medium">{selectedApplication.firstName} {selectedApplication.lastName}</p>
                <p className="text-sm text-muted-foreground">{selectedApplication.referenceNumber}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Update Status</label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        Pending
                      </div>
                    </SelectItem>
                    <SelectItem value="under_review">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-blue-600" />
                        Under Review
                      </div>
                    </SelectItem>
                    <SelectItem value="accepted">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Accepted
                      </div>
                    </SelectItem>
                    <SelectItem value="rejected">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        Rejected
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Admin Notes</label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this application..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  These notes will be included in the email sent to the applicant if you accept or reject.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={updateMutation.isPending || !newStatus}
            >
              {updateMutation.isPending ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
