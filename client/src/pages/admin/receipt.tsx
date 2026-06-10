import { useState, useRef } from "react";
import { Link } from "wouter";
import { ArrowLeft, Download, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import signatureUrl from "@/lib/logos/signature.png";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function AdminReceipt() {
  const { toast } = useToast();
  const receiptRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    address: "",
    paymentDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }),
    paymentMethod: "Bank Transfer",
    paymentReference: "",
    eventName: "AI Africa Summit",
    description: "Summit Registration",
    delegates: 1,
    amountPaid: "",
    receiptNumber: "001",
  });

  const getReceiptNumber = (org: string, number: string) => {
    let prefix = "AIIA";
    if (org && org.trim().length > 0) {
      const words = org.trim().split(/\s+/);
      if (words.length === 1) {
        prefix = words[0].substring(0, 3).toUpperCase();
      } else {
        prefix = words.map(w => w.charAt(0)).join("").toUpperCase();
      }
    }
    const padded = number.padStart(3, "0");
    return `${prefix}-${padded}`;
  };

  const handleDownload = async () => {
    if (!receiptRef.current) return;
    if (!formData.name) {
      toast({ title: "Error", description: "Name is required.", variant: "destructive" });
      return;
    }
    if (!formData.amountPaid) {
      toast({ title: "Error", description: "Amount is required.", variant: "destructive" });
      return;
    }

    setGenerating(true);
    try {
      const canvas = await html2canvas(receiptRef.current, { scale: 3, useCORS: true, logging: false });
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      
      pdf.save(`${formData.name.replace(/\s+/g, "_")}_Receipt.pdf`);
      toast({ title: "Success", description: "Receipt generated successfully." });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to generate PDF.", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  // Static Assets
  const logoUrl = "https://aiinstituteafrica.com/wp-content/uploads/2024/09/Logo.png";

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manual Receipt Generator</h2>
          <p className="text-muted-foreground text-sm mt-1">Generate a standalone receipt outside of the invoice system</p>
        </div>
        <Link href="/admin/dashboard">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4 border rounded-xl p-6 bg-card">
          <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
            <Receipt className="h-5 w-5 text-emerald-600" />
            Receipt Details
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">Full Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. John Doe"
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">Organization Name</label>
              <Input
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="e.g. AIIA"
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">Address</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. 123 Main St, Harare"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Payment Date</label>
              <Input
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Payment Method</label>
              <Input
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Payment Reference</label>
              <Input
                value={formData.paymentReference}
                onChange={(e) => setFormData({ ...formData, paymentReference: e.target.value })}
                placeholder="e.g. POP-123"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Receipt Sequence #</label>
              <Input
                value={formData.receiptNumber}
                onChange={(e) => setFormData({ ...formData, receiptNumber: e.target.value })}
                placeholder="001"
              />
            </div>
            <div className="col-span-2 mt-4 pt-4 border-t">
              <h4 className="text-sm font-bold mb-2">Item Details</h4>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">Event Name(s)</label>
              <Input
                value={formData.eventName}
                onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">Package Description</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Number of Delegates</label>
              <Input
                type="number"
                min="1"
                value={formData.delegates}
                onChange={(e) => setFormData({ ...formData, delegates: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Total Amount Paid (USD) *</label>
              <Input
                type="number"
                step="0.01"
                value={formData.amountPaid}
                onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
                placeholder="e.g. 500.00"
              />
            </div>
          </div>

          <Button 
            className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700" 
            onClick={handleDownload}
            disabled={generating}
          >
            <Download className="h-4 w-4 mr-2" />
            {generating ? "Generating PDF..." : "Download Receipt PDF"}
          </Button>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4 text-muted-foreground">Live Preview (For reference)</h3>
          
          {/* Hidden unscaled version for PDF generation */}
          <div style={{ position: "fixed", top: 0, left: -9999, opacity: 0.001, pointerEvents: "none" }}>
            <div ref={receiptRef} style={{ background: "#fff", borderRadius: 12, padding: "40px 48px", color: "#111", width: 794, fontFamily: "Inter, Arial, sans-serif", textRendering: "geometricPrecision", fontVariantLigatures: "none", letterSpacing: "normal" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#059669", marginBottom: 4 }}>· Receipt</div>
                  <div style={{ fontSize: 14, color: "#6b7280" }}>Receipt Number: <strong>{getReceiptNumber(formData.organization, formData.receiptNumber)}</strong></div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <img src={logoUrl} alt="AIIA" style={{ height: 130, objectFit: "contain", marginBottom: 12 }} onError={(e) => (e.currentTarget.style.display = "none")} />
                  <div style={{ fontWeight: 700, fontSize: 14 }}>Artificial Intelligence Initiative Africa</div>
                  <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
                    275 Herbert Chitepo Ave, Harare, Zimbabwe<br />
                    +263 78 6434 988<br />
                    admin@aiinstituteafrica.com<br />
                    www.aiinstituteafrica.com
                  </div>
                </div>
              </div>
              <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", marginBottom: 28 }} />
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 15 }}>Received From:</div>
                <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 14 }}>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: 700, width: "180px", paddingBottom: "6px" }}>Date:</td>
                      <td style={{ paddingBottom: "6px" }}>{formData.paymentDate || "—"}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 700, paddingBottom: "6px" }}>Name:</td>
                      <td style={{ paddingBottom: "6px" }}>{formData.name || "—"}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 700, paddingBottom: "6px" }}>Organization Name:</td>
                      <td style={{ paddingBottom: "6px" }}>{formData.organization || "—"}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 700, paddingBottom: "6px" }}>Address:</td>
                      <td style={{ paddingBottom: "6px" }}>{formData.address || "—"}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 700, paddingBottom: "6px" }}>Payment Method:</td>
                      <td style={{ paddingBottom: "6px" }}>{formData.paymentMethod || "—"}</td>
                    </tr>
                    {formData.paymentReference && (
                      <tr>
                        <td style={{ fontWeight: 700, paddingBottom: "6px" }}>Payment Reference:</td>
                        <td style={{ paddingBottom: "6px" }}>{formData.paymentReference}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 14 }}>
                Event Name(s):<span style={{ fontWeight: 400, marginLeft: "6px" }}>{formData.eventName || "—"}</span>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 28 }}>
                <thead>
                  <tr style={{ background: "#111", color: "#fff" }}>
                    <th style={{ padding: "12px 14px", textAlign: "left", border: "1px dashed #555" }}>Description</th>
                    <th style={{ padding: "12px 14px", textAlign: "center", border: "1px dashed #555" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "14px", border: "1px dashed #ccc" }}>
                      {formData.description || "—"} <span style={{ marginLeft: "4px" }}>({formData.delegates} Delegates)</span>
                    </td>
                    <td style={{ padding: "14px", textAlign: "center", border: "1px dashed #ccc" }}>{parseFloat(formData.amountPaid || "0").toFixed(2)}</td>
                  </tr>
                  <tr style={{ fontWeight: 800 }}>
                    <td style={{ padding: "14px", textAlign: "right", border: "1px dashed #ccc" }}>TOTAL PAID:</td>
                    <td style={{ padding: "14px", textAlign: "center", border: "1px dashed #ccc", color: "#059669" }}>
                      USD <span style={{ marginLeft: "4px" }}>{parseFloat(formData.amountPaid || "0").toFixed(2)}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div style={{ marginBottom: 24 }}>
                <div>Authorized Signature (Ms. Mupikeni) AI Institute Administrator</div>
                <img src={signatureUrl} alt="Signature" style={{ height: 45, objectFit: "contain", marginTop: 4, display: "block" }} />
              </div>
              <div style={{ textAlign: "center", color: "#6b7280", fontSize: 13, marginTop: 40 }}>
                Thank you for your payment and support.
              </div>
            </div>
          </div>

          {/* Scaled version for live visual preview ONLY */}
          <div className="border rounded-xl bg-white overflow-hidden" style={{ transform: "scale(0.8)", transformOrigin: "top left" }}>
            <div style={{ background: "#fff", borderRadius: 12, padding: "40px 48px", color: "#111", width: 794, fontFamily: "Inter, Arial, sans-serif", textRendering: "geometricPrecision", fontVariantLigatures: "none", letterSpacing: "normal" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#059669", marginBottom: 4 }}>· Receipt</div>
                  <div style={{ fontSize: 14, color: "#6b7280" }}>Receipt Number: <strong>{getReceiptNumber(formData.organization, formData.receiptNumber)}</strong></div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <img src={logoUrl} alt="AIIA" style={{ height: 130, objectFit: "contain", marginBottom: 12 }} onError={(e) => (e.currentTarget.style.display = "none")} />
                  <div style={{ fontWeight: 700, fontSize: 14 }}>Artificial Intelligence Initiative Africa</div>
                  <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
                    275 Herbert Chitepo Ave, Harare, Zimbabwe<br />
                    +263 78 6434 988<br />
                    admin@aiinstituteafrica.com<br />
                    www.aiinstituteafrica.com
                  </div>
                </div>
              </div>
              <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", marginBottom: 28 }} />
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 15 }}>Received From:</div>
                <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 14 }}>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: 700, width: "180px", paddingBottom: "6px" }}>Date:</td>
                      <td style={{ paddingBottom: "6px" }}>{formData.paymentDate || "—"}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 700, paddingBottom: "6px" }}>Name:</td>
                      <td style={{ paddingBottom: "6px" }}>{formData.name || "—"}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 700, paddingBottom: "6px" }}>Organization Name:</td>
                      <td style={{ paddingBottom: "6px" }}>{formData.organization || "—"}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 700, paddingBottom: "6px" }}>Address:</td>
                      <td style={{ paddingBottom: "6px" }}>{formData.address || "—"}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 700, paddingBottom: "6px" }}>Payment Method:</td>
                      <td style={{ paddingBottom: "6px" }}>{formData.paymentMethod || "—"}</td>
                    </tr>
                    {formData.paymentReference && (
                      <tr>
                        <td style={{ fontWeight: 700, paddingBottom: "6px" }}>Payment Reference:</td>
                        <td style={{ paddingBottom: "6px" }}>{formData.paymentReference}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 14 }}>
                Event Name(s):<span style={{ fontWeight: 400, marginLeft: "6px" }}>{formData.eventName || "—"}</span>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 28 }}>
                <thead>
                  <tr style={{ background: "#111", color: "#fff" }}>
                    <th style={{ padding: "12px 14px", textAlign: "left", border: "1px dashed #555" }}>Description</th>
                    <th style={{ padding: "12px 14px", textAlign: "center", border: "1px dashed #555" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "14px", border: "1px dashed #ccc" }}>
                      {formData.description || "—"} <span style={{ marginLeft: "4px" }}>({formData.delegates} Delegates)</span>
                    </td>
                    <td style={{ padding: "14px", textAlign: "center", border: "1px dashed #ccc" }}>{parseFloat(formData.amountPaid || "0").toFixed(2)}</td>
                  </tr>
                  <tr style={{ fontWeight: 800 }}>
                    <td style={{ padding: "14px", textAlign: "right", border: "1px dashed #ccc" }}>TOTAL PAID:</td>
                    <td style={{ padding: "14px", textAlign: "center", border: "1px dashed #ccc", color: "#059669" }}>
                      USD <span style={{ marginLeft: "4px" }}>{parseFloat(formData.amountPaid || "0").toFixed(2)}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div style={{ marginBottom: 24 }}>
                <div>Authorized Signature (Ms. Mupikeni) AI Institute Administrator</div>
                <img src={signatureUrl} alt="Signature" style={{ height: 45, objectFit: "contain", marginTop: 4, display: "block" }} />
              </div>
              <div style={{ textAlign: "center", color: "#6b7280", fontSize: 13, marginTop: 40 }}>
                Thank you for your payment and support.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
