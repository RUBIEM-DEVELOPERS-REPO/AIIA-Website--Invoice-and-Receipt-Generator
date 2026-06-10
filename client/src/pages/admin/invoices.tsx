import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Search,
  ArrowLeft,
  Download,
  Mail,
  Edit3,
  Save,
  X,
  FileText,
  Eye,
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
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logoUrl from "@/lib/logos/AiiA Logo.png";
import signatureUrl from "@/lib/logos/signature.png";

// ─── Constants (shared with summit-portal) ──────────────────────────────────
const BANK_ACCOUNTS = [
  { bankName: "ZB Bank", accountName: "Artificial Intelligence Initiative Africa", accountNumber: "413001228226400" },
  { bankName: "AFC HOLDINGS Bank", accountName: "AI INITIATIVE AFRICA PVT LTD", accountNumber: "1014884111301-USD" },
  { bankName: "POSB Bank", accountName: "ARTIFICIAL INTELLIGENCE INITIATIVE AFRICA", accountNumber: "500009764761" },
];
const getBankAccountByIndex = (invoiceNumber: string) => {
  const match = invoiceNumber.match(/(\d+)$/);
  if (!match) return BANK_ACCOUNTS[0];
  const num = parseInt(match[1]);
  return BANK_ACCOUNTS[Math.abs((num - 1) % BANK_ACCOUNTS.length)];
};

const getRegistrationNumber = (referenceNum: string, eventName: string) => {
  if (!referenceNum) return "";
  const suffix = referenceNum.includes("-") ? referenceNum.split("-")[1] : referenceNum.slice(-8);
  const isS1 = eventName?.includes("AI Tech Forum");
  const isS2 = eventName?.includes("National AI for Transformation");

  if (isS1 && isS2) {
    return `AIIA-TF-NT-${suffix}`;
  } else if (isS1) {
    return `AIIA-TF-${suffix}`;
  } else if (isS2) {
    return `AIIA-NT-${suffix}`;
  }
  return `AIIA-${suffix}`;
};

const SUMMIT_1 = { name: "AI Tech Forum", dates: "16–17 June 2026" };
const SUMMIT_2 = { name: "National AI for Transformation: Zimbabwe 2.0", dates: "17–18 June 2026" };

type Invoice = {
  id: number;
  referenceNumber: string;
  invoiceNumber: string;
  fullName: string;
  organization: string | null;
  address: string | null;
  email: string;
  phone: string | null;
  paymentMethod: string;
  currency: string;
  numberOfDelegates: number;
  packageType: string;
  packageDescription: string;
  packagePrice: string;
  secondEventPrice: string | null;
  bothEvents: string | null;
  summitEvent: string;
  totalAmount: string;
  createdAt: string;
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 6,
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(255,255,255,0.07)",
  color: "#fff",
  fontSize: 13,
};
const labelStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#94a3b8",
  marginBottom: 4,
  display: "block",
};

export default function AdminInvoicesPage() {
  const { toast } = useToast();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // View / Edit dialog
  const [viewOpen, setViewOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<Partial<Invoice>>({});

  // Email dialog
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [sending, setSending] = useState(false);
  const [generating, setGenerating] = useState(false);

  // ─── Fetch invoices ────────────────────────────────────────────────────────
  const { data: invoices = [], isLoading } = useQuery<Invoice[]>({
    queryKey: ["/api/admin/invoices"],
  });

  // ─── Update invoice mutation ───────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Invoice> }) => {
      const res = await apiRequest("PATCH", `/api/admin/invoices/${id}`, data);
      return res.json();
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/invoices"] });
      setSelectedInvoice(updated);
      setEditMode(false);
      toast({ title: "Saved", description: "Invoice updated successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update invoice.", variant: "destructive" });
    },
  });

  // ─── Filtered list ─────────────────────────────────────────────────────────
  const filtered = invoices.filter((inv) => {
    const q = search.toLowerCase();
    return (
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.fullName.toLowerCase().includes(q) ||
      inv.email.toLowerCase().includes(q) ||
      inv.referenceNumber.toLowerCase().includes(q)
    );
  });

  // ─── Open view dialog ──────────────────────────────────────────────────────
  const openView = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setEditMode(false);
    setEditData({});
    setViewOpen(true);
  };

  const startEdit = () => {
    if (!selectedInvoice) return;
    setEditData({ ...selectedInvoice });
    setEditMode(true);
  };

  const saveEdit = () => {
    if (!selectedInvoice) return;
    // Recalculate total if prices changed
    const p1 = parseFloat(String(editData.packagePrice ?? selectedInvoice.packagePrice)) || 0;
    const p2 = parseFloat(String(editData.secondEventPrice ?? selectedInvoice.secondEventPrice ?? "0")) || 0;
    const delegates = parseInt(String(editData.numberOfDelegates ?? selectedInvoice.numberOfDelegates)) || 1;
    const isDual = (editData.summitEvent ?? selectedInvoice.summitEvent)?.includes("+");
    const newTotal = isDual ? (p1 + p2) * delegates : p1 * delegates;
    updateMutation.mutate({
      id: selectedInvoice.id,
      data: { ...editData, packagePrice: p1.toString(), secondEventPrice: p2.toString(), totalAmount: newTotal.toString() },
    });
  };

  // ─── Generate & download PDF ───────────────────────────────────────────────
  const generatePDF = async (inv: Invoice): Promise<string | null> => {
    if (!invoiceRef.current) return null;
    const canvas = await html2canvas(invoiceRef.current, {
      scale: 1.5,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });
    const imgData = canvas.toDataURL("image/jpeg", 0.75);
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * pdfW) / canvas.width;
    const scale = imgHeight > pdfH ? pdfH / imgHeight : 1;
    pdf.addImage(imgData, "JPEG", 0, 0, pdfW * scale, imgHeight * scale);
    return pdf.output("datauristring");
  };

  const handleDownload = async (inv: Invoice) => {
    setSelectedInvoice(inv);
    setViewOpen(true);
    // Small delay to let DOM render
    setTimeout(async () => {
      setGenerating(true);
      try {
        const pdfBase64 = await generatePDF(inv);
        if (!pdfBase64) return;
        const link = document.createElement("a");
        link.href = pdfBase64;
        link.download = `Invoice-${inv.invoiceNumber}.pdf`;
        link.click();
        toast({ title: "Downloaded", description: `Invoice ${inv.invoiceNumber} downloaded.` });
      } catch {
        toast({ title: "Error", description: "Failed to generate PDF.", variant: "destructive" });
      } finally {
        setGenerating(false);
      }
    }, 600);
  };

  // ─── Open email dialog ─────────────────────────────────────────────────────
  const openEmail = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setEmailSubject(`Your Summit Invoice - ${inv.invoiceNumber}`);
    setEmailBody(
      `Dear ${inv.fullName},\n\nPlease find your invoice attached to this email.\n\nInvoice Number: ${inv.invoiceNumber}\nTotal Amount: ${inv.currency} ${parseFloat(inv.totalAmount).toFixed(2)}\n\nKindly make payment by 8 June 2026 using your invoice number as reference.\n\nThank you,\nAI Institute Africa`
    );
    setViewOpen(true);
    // Need invoice to render first for PDF
    setTimeout(() => setEmailOpen(true), 400);
  };

  const handleSendEmail = async () => {
    if (!selectedInvoice) return;
    setSending(true);
    try {
      const pdfBase64 = await generatePDF(selectedInvoice);
      if (!pdfBase64) throw new Error("PDF generation failed");

      const res = await fetch(`/api/admin/invoices/${selectedInvoice.id}/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ pdfBase64, emailSubject, emailBody }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to send");
      }
      toast({ title: "Email Sent", description: `Invoice emailed to ${selectedInvoice.email}` });
      setEmailOpen(false);
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to send email.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  // ─── Invoice renderable (hidden, used for PDF generation) ─────────────────
  const renderInvoicePreview = (inv: Invoice, isPrint: boolean = false) => {
    const invoiceIsDual = inv.summitEvent?.includes("+") || inv.bothEvents === "true";
    const invDelegates = inv.numberOfDelegates || 1;
    const p1 = parseFloat(inv.packagePrice) || 0;
    const p2 = parseFloat(inv.secondEventPrice || "0") || 0;
    const total = parseFloat(inv.totalAmount) || 0;
    const selectedBank = getBankAccountByIndex(inv.invoiceNumber);
    const selectedDate = new Date(inv.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

    return (
      <div ref={isPrint ? invoiceRef : null} style={{ background: "#fff", borderRadius: 12, padding: 0, color: "#111", fontSize: 13, overflow: "hidden", width: 794, fontFamily: "Arial, sans-serif", letterSpacing: "normal" }}>
        <div style={{ padding: "0 24px", marginBottom: 24, paddingTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 48, fontWeight: 800, color: "#111" }}>INVOICE</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <img src={logoUrl} alt="AIIA Logo" style={{ height: 110, objectFit: "contain" }} onError={(e) => (e.currentTarget.style.display = "none")} />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", gap: 40 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: "#1e40af", fontSize: 12, marginBottom: 8 }}>Artificial Intelligence Initiative Africa</div>
              <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.6 }}>
                275 Herbert Chitepo Ave<br />
                Harare, Zimbabwe<br />
                +263 78 6434 988<br />
                admin@aiinstituteafrica.com
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: "#1e40af", fontSize: 12, marginBottom: 8 }}>INVOICE TO:</div>
              <div style={{ fontSize: 11, color: "#111", lineHeight: 1.6 }}>
                <div style={{ fontWeight: 600 }}>{inv.fullName}</div>
                <div>{inv.organization || "—"}</div>
                <div>{inv.address || "—"}</div>
                <div>{inv.phone || "—"}</div>
                <div>{inv.email}</div>
              </div>
            </div>

            <div style={{ flex: 1, textAlign: "right" }}>
              <div style={{ fontSize: 11, lineHeight: 1.8 }}>
                <div><strong style={{ color: "#1e40af" }}>Invoice Number</strong><br /><span style={{ fontSize: 12, fontWeight: 600 }}>{inv.invoiceNumber}</span></div>
                <div style={{ marginTop: 8 }}><strong style={{ color: "#1e40af" }}>Date of Invoice</strong><br /><span style={{ fontSize: 12, fontWeight: 600 }}>{selectedDate}</span></div>
                <div style={{ marginTop: 8 }}><strong style={{ color: "#1e40af" }}>Registration #</strong><br /><span style={{ fontSize: 12, fontWeight: 600 }}>{getRegistrationNumber(inv.referenceNumber, inv.summitEvent)}</span></div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ paddingLeft: 24, paddingRight: 24 }}>
          <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", marginBottom: 14 }} />
        </div>

        <div style={{ padding: "0 24px 24px 24px" }}>
          <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 12 }}>Event Name(s): {inv.summitEvent}</div>

          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12, fontSize: 11 }}>
            <thead>
              <tr style={{ background: "#111", color: "#fff" }}>
                <th style={{ padding: "6px 8px", textAlign: "left", border: "1px dashed #555", fontSize: 11 }}>Description</th>
                <th style={{ padding: "6px 8px", textAlign: "center", border: "1px dashed #555", fontSize: 11 }}>Unit Price ({inv.currency})</th>
                <th style={{ padding: "6px 8px", textAlign: "center", border: "1px dashed #555", fontSize: 11 }}>Delegates</th>
                <th style={{ padding: "6px 8px", textAlign: "center", border: "1px dashed #555", fontSize: 11 }}>Sub-Total ({inv.currency})</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "6px 8px", border: "1px dashed #ccc" }}>
                  <strong style={{ fontSize: 11 }}>{invoiceIsDual ? `${SUMMIT_1.name}: ${SUMMIT_1.dates}` : `${inv.summitEvent}`}</strong><br />
                  <span style={{ fontSize: 10, color: "#6b7280" }}>{inv.packageDescription}</span>
                </td>
                <td style={{ padding: "6px 8px", textAlign: "center", border: "1px dashed #ccc" }}>{p1.toFixed(2)}</td>
                <td style={{ padding: "6px 8px", textAlign: "center", border: "1px dashed #ccc" }}>{invDelegates}</td>
                <td style={{ padding: "6px 8px", textAlign: "center", border: "1px dashed #ccc" }}>{(p1 * invDelegates).toFixed(2)}</td>
              </tr>
              {invoiceIsDual && p2 > 0 && (
                <tr>
                  <td style={{ padding: "6px 8px", border: "1px dashed #ccc" }}>
                    <strong style={{ fontSize: 11 }}>{SUMMIT_2.name}: {SUMMIT_2.dates}</strong><br />
                    <span style={{ fontSize: 10, color: "#6b7280" }}>{inv.packageDescription}</span><br />
                    <span style={{ fontSize: 10, color: "#7c3aed", fontWeight: 600 }}>✦ 20% Bundle Discount Applied</span>
                  </td>
                  <td style={{ padding: "6px 8px", textAlign: "center", border: "1px dashed #ccc" }}>
                    <span style={{ textDecoration: "line-through", color: "#9ca3af", fontSize: 10, display: "block" }}>{p1.toFixed(2)}</span>
                    {p2.toFixed(2)}
                  </td>
                  <td style={{ padding: "6px 8px", textAlign: "center", border: "1px dashed #ccc" }}>{invDelegates}</td>
                  <td style={{ padding: "6px 8px", textAlign: "center", border: "1px dashed #ccc" }}>{(p2 * invDelegates).toFixed(2)}</td>
                </tr>
              )}
              <tr style={{ fontWeight: 700 }}>
                <td colSpan={3} style={{ padding: "6px 8px", border: "1px dashed #ccc" }}>Total</td>
                <td style={{ padding: "6px 8px", textAlign: "center", border: "1px dashed #ccc" }}>{inv.currency} {total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11 }}>Authorized Signature (Ms. Mupikeni) AI Institute Administrator</div>
            <img src={signatureUrl} alt="Signature" style={{ height: 35, objectFit: "contain", marginTop: 2, display: "block" }} />
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", marginBottom: 8 }} />
          <div style={{ fontWeight: 700, marginBottom: 3, fontSize: 11 }}>Bank Name: {selectedBank.bankName}</div>
          <div style={{ marginBottom: 2, fontSize: 11 }}><strong>Account Name:</strong> {selectedBank.accountName}</div>
          <div style={{ marginBottom: 2, fontSize: 11 }}><strong>Account Number:</strong> {selectedBank.accountNumber}</div>
          <div style={{ fontWeight: 700, marginBottom: 2, marginTop: 4, fontSize: 11 }}>Payment Terms:</div>
          <div style={{ fontSize: 11, lineHeight: 1.3 }}>• Kindly note that the Payment should be made at the latest by <strong>8 June 2026</strong></div>
          <div style={{ fontSize: 11, lineHeight: 1.3 }}>• Please use the invoice number as payment reference</div>
        </div>
      </div>
    );
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="container mx-auto py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Summit Invoices</h2>
            <p className="text-muted-foreground text-sm mt-1">All generated invoices — edit, download, or email to clients</p>
          </div>
          <Link href="/admin/dashboard">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, invoice # or reference..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[360px]"
            />
          </div>
          <span className="text-sm text-muted-foreground">Total: {filtered.length} invoice{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Delegates</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-16 text-muted-foreground">
                    <FileText className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    No invoices found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-mono text-sm font-semibold">{inv.invoiceNumber}</TableCell>
                    <TableCell>
                      <div className="font-medium">{inv.fullName}</div>
                      {inv.organization && <div className="text-xs text-muted-foreground">{inv.organization}</div>}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{inv.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs max-w-[160px] truncate block">
                        {inv.summitEvent?.includes("+") ? "Both Events" : inv.summitEvent?.includes("National") ? "Summit 2" : "Summit 1"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">{inv.currency} {parseFloat(inv.totalAmount).toFixed(2)}</TableCell>
                    <TableCell className="text-center">{inv.numberOfDelegates}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(inv.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openView(inv)} title="View / Edit">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDownload(inv)} title="Download PDF">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openEmail(inv)} title="Send Email">
                          <Mail className="h-4 w-4" />
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

      {/* ─── View / Edit Dialog ─────────────────────────────────────────────── */}
      <Dialog open={viewOpen} onOpenChange={(o) => { if (!o) { setViewOpen(false); setEditMode(false); } }}>
        <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <FileText className="h-5 w-5" />
              Invoice {selectedInvoice?.invoiceNumber}
              <Badge variant="outline" className="ml-2">{selectedInvoice?.referenceNumber}</Badge>
            </DialogTitle>
          </DialogHeader>

          {selectedInvoice && (
            <>
              {/* Edit panel */}
              {editMode && (
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: 20, marginBottom: 20 }}>
                  <h3 style={{ color: "#fff", margin: "0 0 14px", fontSize: 14, fontWeight: 700 }}>Edit Invoice Details</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div style={{ gridColumn: "span 2" }}>
                      <label style={labelStyle}>Full Name</label>
                      <input value={editData.fullName ?? ""} onChange={(e) => setEditData({ ...editData, fullName: e.target.value })} style={inputStyle} />
                    </div>
                    <div style={{ gridColumn: "span 2" }}>
                      <label style={labelStyle}>Organization</label>
                      <input value={editData.organization ?? ""} onChange={(e) => setEditData({ ...editData, organization: e.target.value })} style={inputStyle} />
                    </div>
                    <div style={{ gridColumn: "span 2" }}>
                      <label style={labelStyle}>Address</label>
                      <input value={editData.address ?? ""} onChange={(e) => setEditData({ ...editData, address: e.target.value })} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Phone</label>
                      <input value={editData.phone ?? ""} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Email</label>
                      <input value={editData.email ?? ""} onChange={(e) => setEditData({ ...editData, email: e.target.value })} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Payment Method</label>
                      <input value={editData.paymentMethod ?? ""} onChange={(e) => setEditData({ ...editData, paymentMethod: e.target.value })} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Number of Delegates</label>
                      <input type="number" min={1} value={editData.numberOfDelegates ?? 1} onChange={(e) => setEditData({ ...editData, numberOfDelegates: parseInt(e.target.value) })} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Primary Event Unit Price ({selectedInvoice.currency})</label>
                      <input type="number" step="0.01" value={editData.packagePrice ?? ""} onChange={(e) => setEditData({ ...editData, packagePrice: e.target.value })} style={inputStyle} />
                    </div>
                    {(selectedInvoice.summitEvent?.includes("+") || selectedInvoice.bothEvents === "true") && (
                      <div>
                        <label style={labelStyle}>Secondary Event Unit Price ({selectedInvoice.currency})</label>
                        <input type="number" step="0.01" value={editData.secondEventPrice ?? ""} onChange={(e) => setEditData({ ...editData, secondEventPrice: e.target.value })} style={inputStyle} />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Hidden invoice DOM for PDF */}
              <div style={{ position: "fixed", top: 0, left: -9999, width: 794, opacity: 0.001, pointerEvents: "none" }}>
                {renderInvoicePreview(editMode ? ({ ...selectedInvoice, ...editData } as Invoice) : selectedInvoice, true)}
              </div>

              {/* Visible invoice preview (scaled) */}
              <div style={{ transform: "scale(0.72)", transformOrigin: "top left", width: "139%", marginBottom: -180, pointerEvents: "none" }}>
                {renderInvoicePreview(editMode ? ({ ...selectedInvoice, ...editData } as Invoice) : selectedInvoice, false)}
              </div>
            </>
          )}

          <DialogFooter className="gap-2 pt-2">
            {!editMode ? (
              <>
                <Button variant="outline" onClick={() => { setViewOpen(false); }}>Close</Button>
                <Button variant="outline" onClick={startEdit}>
                  <Edit3 className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button variant="outline" onClick={async () => {
                  if (!selectedInvoice) return;
                  setGenerating(true);
                  try {
                    const pdfBase64 = await generatePDF(selectedInvoice);
                    if (!pdfBase64) return;
                    const link = document.createElement("a");
                    link.href = pdfBase64;
                    link.download = `Invoice-${selectedInvoice.invoiceNumber}.pdf`;
                    link.click();
                  } finally { setGenerating(false); }
                }} disabled={generating}>
                  <Download className="h-4 w-4 mr-2" /> {generating ? "Generating..." : "Download PDF"}
                </Button>
                <Button onClick={() => { setEmailSubject(`Your Summit Invoice - ${selectedInvoice?.invoiceNumber}`); setEmailBody(`Dear ${selectedInvoice?.fullName},\n\nPlease find your invoice attached.\n\nInvoice: ${selectedInvoice?.invoiceNumber}\nTotal: ${selectedInvoice?.currency} ${parseFloat(selectedInvoice?.totalAmount ?? "0").toFixed(2)}\n\nKindly pay by 8 June 2026.\n\nThank you,\nAI Institute Africa`); setEmailOpen(true); }}>
                  <Mail className="h-4 w-4 mr-2" /> Send Email
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setEditMode(false)}>
                  <X className="h-4 w-4 mr-2" /> Cancel
                </Button>
                <Button onClick={saveEdit} disabled={updateMutation.isPending}>
                  <Save className="h-4 w-4 mr-2" /> {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Email Dialog ───────────────────────────────────────────────────── */}
      <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Invoice to {selectedInvoice?.fullName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium mb-1 block">To</label>
              <Input value={selectedInvoice?.email ?? ""} disabled className="bg-muted" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Subject</label>
              <Input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Email Body</label>
              <Textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                rows={9}
                className="text-sm font-mono"
              />
            </div>
            <p className="text-xs text-muted-foreground">The invoice PDF will be automatically generated and attached.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailOpen(false)}>Cancel</Button>
            <Button onClick={handleSendEmail} disabled={sending}>
              <Mail className="h-4 w-4 mr-2" />
              {sending ? "Sending..." : "Send Email + PDF"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
