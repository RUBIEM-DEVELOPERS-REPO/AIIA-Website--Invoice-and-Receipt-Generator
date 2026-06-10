import { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logoUrl from "@/lib/logos/AiiA Logo.png";
import signatureUrl from "@/lib/logos/signature.png";

const PACKAGES = [
  { id: "pkg1", label: "Summit + Hotel + Dinner + Transport (Harare-Masvingo)", price: 765 },
  { id: "pkg2", label: "Summit + Hotel + Dinner", price: 720 },
  { id: "pkg3", label: "Summit + Dinner", price: 570 },
];

const SUMMIT_1 = { id: "s1", label: "AI Tech Forum: 16–17 June 2026", dates: "16–17 June 2026", name: "AI Tech Forum" };
const SUMMIT_2 = { id: "s2", label: "National AI for Transformation: Zimbabwe 2.0", dates: "18–19 June 2026", name: "National AI for Transformation: Zimbabwe 2.0" };
const DISCOUNT_RATE = 0.15; // 15% discount on Summit 2 when both chosen

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

type Step = "login" | "payment" | "invoice" | "proof" | "delegates" | "summary";

export default function SummitPortal() {
  const params = new URLSearchParams(window.location.search);
  const refFromUrl = params.get("ref") || "";

  const [step, setStep] = useState<Step>("login");
  const [refInput, setRefInput] = useState(refFromUrl);
  const [registration, setRegistration] = useState<any>(null);
  const [existingInvoice, setExistingInvoice] = useState<any>(null);
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });

  // New invoice without reference number
  const [loginMode, setLoginMode] = useState<"lookup" | "create">("lookup");
  const [newInvoiceDetails, setNewInvoiceDetails] = useState({ fullName: "", organization: "", email: "", phone: "" });

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [currency, setCurrency] = useState("USD");
  const [delegates, setDelegates] = useState(1);
  const [selectedPkg, setSelectedPkg] = useState(PACKAGES[0]);
  const [summit1Selected, setSummit1Selected] = useState(true);
  const [summit2Selected, setSummit2Selected] = useState(false);
  const [address, setAddress] = useState("");
  const [invoice, setInvoice] = useState<any>(null);
  const [isNewInvoice, setIsNewInvoice] = useState(false);
  const [hasEmailedInvoice, setHasEmailedInvoice] = useState(false);

  // Payment proof state
  const [payerName, setPayerName] = useState("");
  const [paymentRef, setPaymentRef] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentLocation, setPaymentLocation] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);

  // Delegates state
  const [delegateNames, setDelegateNames] = useState<string[]>([""]);

  // Invoice edit mode
  const [invoiceEditMode, setInvoiceEditMode] = useState(false);
  const [editInvoiceData, setEditInvoiceData] = useState<any>(null);

  const invoiceRef = useRef<HTMLDivElement>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  // Pricing logic
  const bothSelected = summit1Selected && summit2Selected;
  const s1Price = selectedPkg.price;
  const s2FullPrice = selectedPkg.price;
  const s2DiscountedPrice = parseFloat((s2FullPrice * (1 - DISCOUNT_RATE)).toFixed(2));
  const perDelegatePrice = bothSelected ? s1Price + s2DiscountedPrice : s1Price;
  const grandTotal = parseFloat((perDelegatePrice * delegates).toFixed(2));

  const selectedSummitLabel = bothSelected
    ? `${SUMMIT_1.label} + ${SUMMIT_2.label}`
    : summit1Selected
    ? SUMMIT_1.label
    : SUMMIT_2.label;

  const showToast = (msg: string, type = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "success" }), 4000);
  };

  useEffect(() => {
    if (refFromUrl) handleLogin(refFromUrl);
  }, []);

  // Auto-email invoice when newly generated
  useEffect(() => {
    if (step === "invoice" && invoiceRef.current && invoice && isNewInvoice && !hasEmailedInvoice && registration) {
      setHasEmailedInvoice(true);
      setTimeout(async () => {
        try {
          if (!invoiceRef.current) return;
          const canvas = await html2canvas(invoiceRef.current, { scale: 2, useCORS: true });
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
          const pdfW = pdf.internal.pageSize.getWidth();
          const pdfH = (canvas.height * pdfW) / canvas.width;
          pdf.addImage(imgData, "PNG", 0, 0, pdfW, pdfH);
          const pdfBase64 = pdf.output("datauristring");
          const res = await fetch(`/api/summit-portal/${registration.referenceNumber}/email-invoice`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pdfBase64 }),
          });
          if (res.ok) showToast("Invoice PDF has been emailed to you and the admin.");
        } catch (e) {
          console.error("Failed to email invoice:", e);
        }
      }, 1000);
    }
  }, [step, invoice, isNewInvoice, hasEmailedInvoice, registration]);

  const handleLogin = async (ref?: string) => {
    const r = ref || refInput;
    if (!r.trim()) return setLoginError("Please enter your reference number");
    setLoading(true);
    setLoginError("");
    try {
      const res = await fetch(`/api/summit-portal/${r.trim()}`);
      const data = await res.json();
      if (!res.ok) { setLoginError(data.message); return; }
      setRegistration(data.registration);
      setPayerName(data.registration.fullName);
      if (data.invoice) {
        setExistingInvoice(data.invoice);
        setInvoice(data.invoice);
        setStep("invoice");
      } else {
        setStep("payment");
      }
    } catch {
      setLoginError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewInvoice = async () => {
    if (!newInvoiceDetails.fullName.trim() || !newInvoiceDetails.email.trim() || !newInvoiceDetails.phone.trim()) {
      return setLoginError("Please enter your name, email, and phone number");
    }
    
    setLoading(true);
    setLoginError("");
    
    try {
      const response = await fetch("/api/summit-portal/register-new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: newInvoiceDetails.fullName,
          email: newInvoiceDetails.email,
          organization: newInvoiceDetails.organization,
          phone: newInvoiceDetails.phone,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create registration");
      }

      const data = await response.json();
      const { registration: newReg } = data;
      
      setRegistration(newReg);
      setPayerName(newReg.fullName);
      setRefInput(newReg.referenceNumber);
      setStep("payment");
      showToast("Registration created successfully!", "success");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to create registration";
      setLoginError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInvoice = async () => {
    if (!summit1Selected && !summit2Selected) {
      return showToast("Please select at least one summit event", "error");
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/summit-portal/${registration.referenceNumber}/invoice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod,
          currency,
          numberOfDelegates: delegates,
          packageType: selectedPkg.id,
          packageDescription: selectedPkg.label,
          packagePrice: s1Price.toString(),
          secondEventPrice: bothSelected ? s2DiscountedPrice.toString() : "0",
          bothEvents: bothSelected,
          discountPercent: bothSelected ? (DISCOUNT_RATE * 100).toString() : "0",
          summitEvent: selectedSummitLabel,
          address,
        }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.message, "error"); return; }
      setInvoice(data.invoice);
      setIsNewInvoice(true);
      setStep("invoice");
      showToast("Invoice generated! Preparing PDF attachment...");
    } catch {
      showToast("Failed to generate invoice", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    const canvas = await html2canvas(invoiceRef.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * pdfW) / canvas.width;
    // Scale down if content exceeds one page
    const scale = imgHeight > pdfH ? pdfH / imgHeight : 1;
    const finalHeight = imgHeight * scale;
    pdf.addImage(imgData, "PNG", 0, 0, pdfW * scale, finalHeight);
    pdf.save(`Invoice-${invoice?.invoiceNumber || "AIIA"}.pdf`);
  };

  const handleDownloadReceiptPDF = async () => {
    if (!receiptRef.current) return;
    const canvas = await html2canvas(receiptRef.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = (canvas.height * pdfW) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfW, pdfH);
    pdf.save(`Receipt-RC-${invoice?.invoiceNumber?.replace("SN-", "") || "AIIA"}.pdf`);
  };

  const handleSubmitProof = async () => {
    if (!payerName || !paymentRef || !paymentDate || !paymentLocation) {
      return showToast("Please fill in all required fields", "error");
    }
    setLoading(true);
    const form = new FormData();
    form.append("payerName", payerName);
    form.append("paymentReference", paymentRef);
    form.append("paymentDate", paymentDate);
    form.append("paymentLocation", paymentLocation);
    if (proofFile) form.append("proof", proofFile);
    try {
      const res = await fetch(`/api/summit-portal/${registration.referenceNumber}/payment-proof`, { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) return showToast(data.message, "error");
      showToast("Payment proof submitted! Admin has been notified.");
      setStep("delegates");
    } catch {
      showToast("Failed to submit proof", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDelegates = async () => {
    const names = delegateNames.filter((n) => n.trim());
    if (names.length === 0) return showToast("Please add at least one delegate", "error");
    setLoading(true);
    try {
      const res = await fetch(`/api/summit-portal/${registration.referenceNumber}/delegates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delegates: names }),
      });
      const data = await res.json();
      if (!res.ok) return showToast(data.message, "error");
      showToast("Delegate list submitted! Admin has been notified.");
      setStep("summary");
    } catch {
      showToast("Failed to submit delegate list", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditInvoice = () => {
    setEditInvoiceData({
      fullName: invoice.fullName,
      organization: invoice.organization,
      address: invoice.address,
      phone: invoice.phone,
      email: invoice.email,
      paymentMethod: invoice.paymentMethod,
    });
    setInvoiceEditMode(true);
  };

  const handleSaveInvoiceChanges = () => {
    setInvoice({
      ...invoice,
      fullName: editInvoiceData.fullName,
      organization: editInvoiceData.organization,
      address: editInvoiceData.address,
      phone: editInvoiceData.phone,
      email: editInvoiceData.email,
      paymentMethod: editInvoiceData.paymentMethod,
    });
    setInvoiceEditMode(false);
    showToast("Invoice details updated successfully.");
  };

  const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

  // Determine if invoice was dual-event (detect from saved summitEvent field)
  const invoiceIsDual = invoice?.summitEvent?.includes("+") || invoice?.bothEvents;
  const invS1Price = invoice ? parseFloat(invoice.packagePrice) : 0;
  const invS2Price = invoice ? parseFloat(invoice.secondEventPrice || 0) : 0;
  const invTotal = invoice ? parseFloat(invoice.totalAmount) : 0;
  const invDelegates = invoice?.numberOfDelegates || 1;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)", padding: "40px 16px", fontFamily: "Inter, Arial, sans-serif" }}>
      {/* Toast */}
      {toast.show && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, background: toast.type === "error" ? "#dc2626" : "#16a34a", color: "#fff", padding: "14px 24px", borderRadius: 10, fontWeight: 600, boxShadow: "0 8px 30px rgba(0,0,0,0.3)", maxWidth: 400 }}>
          {toast.msg}
        </div>
      )}

      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <img src={logoUrl} alt="AIIA" style={{ height: 90, objectFit: "contain" }} onError={(e) => (e.currentTarget.style.display = "none")} />
          </div>
          <h1 style={{ color: "#fff", fontSize: 30, fontWeight: 800, margin: 0 }}>Summit Payment Portal</h1>
          <p style={{ color: "#94a3b8", marginTop: 8 }}>AI Institute Africa — Masvingo 2026</p>
        </div>

        {/* Step tabs */}
        {registration && (
          <div style={{ display: "flex", gap: 4, marginBottom: 28, background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: 6 }}>
            {([
              { key: "payment", label: "💳 Payment" },
              { key: "invoice", label: "🧾 Invoice" },
              { key: "proof", label: "✅ Payment Proof" },
              { key: "delegates", label: "👥 Delegates" },
            ] as { key: Step; label: string }[]).map((tab) => (
              <button key={tab.key} onClick={() => setStep(tab.key)}
                style={{ flex: 1, padding: "10px 8px", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13, transition: "all .2s",
                  background: step === tab.key ? "rgba(255,255,255,0.15)" : "transparent",
                  color: step === tab.key ? "#fff" : "#94a3b8" }}>
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Card */}
        <div style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "36px 32px" }}>

          {/* LOGIN STEP */}
          {step === "login" && (
            <div>
              {/* Mode Toggle */}
              <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
                <button onClick={() => { setLoginMode("lookup"); setLoginError(""); }}
                  style={{ flex: 1, padding: "12px", background: loginMode === "lookup" ? "rgba(8,145,178,0.3)" : "rgba(255,255,255,0.05)", border: `1px solid ${loginMode === "lookup" ? "#0891b2" : "rgba(255,255,255,0.15)"}`, borderRadius: 8, color: "#fff", fontWeight: 600, cursor: "pointer", transition: "all .2s" }}>
                  🔍 Lookup by Reference
                </button>
                <button onClick={() => { setLoginMode("create"); setLoginError(""); }}
                  style={{ flex: 1, padding: "12px", background: loginMode === "create" ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.05)", border: `1px solid ${loginMode === "create" ? "#7c3aed" : "rgba(255,255,255,0.15)"}`, borderRadius: 8, color: "#fff", fontWeight: 600, cursor: "pointer", transition: "all .2s" }}>
                  ➕ Create New Invoice
                </button>
              </div>

              {/* Lookup Mode */}
              {loginMode === "lookup" && (
                <div>
                  <h2 style={{ color: "#fff", marginTop: 0, fontSize: 22 }}>Enter Your Reference Number</h2>
                  <p style={{ color: "#94a3b8", marginBottom: 28 }}>Use the reference number from your registration confirmation email.</p>
                  <label style={labelStyle}>Reference Number</label>
                  <input value={refInput} onChange={(e) => setRefInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    placeholder="e.g. SUMMIT-MP6LCBNZ"
                    style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: 16, outline: "none", boxSizing: "border-box" }} />
                  {loginError && <p style={{ color: "#f87171", marginTop: 8 }}>{loginError}</p>}
                  <button onClick={() => handleLogin()} disabled={loading}
                    style={{ marginTop: 20, width: "100%", padding: "14px", background: "linear-gradient(135deg, #0891b2, #1e40af)", color: "#fff", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
                    {loading ? "Looking up..." : "Access Portal →"}
                  </button>
                </div>
              )}

              {/* Create New Invoice Mode */}
              {loginMode === "create" && (
                <div>
                  <h2 style={{ color: "#fff", marginTop: 0, fontSize: 22 }}>Create New Invoice</h2>
                  <p style={{ color: "#94a3b8", marginBottom: 28 }}>Enter your details to create a new invoice.</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                    <div style={{ gridColumn: "span 2" }}>
                      <label style={labelStyle}>Full Name *</label>
                      <input value={newInvoiceDetails.fullName} onChange={(e) => setNewInvoiceDetails({ ...newInvoiceDetails, fullName: e.target.value })} placeholder="Your full name" style={inputStyle} />
                    </div>
                    <div style={{ gridColumn: "span 2" }}>
                      <label style={labelStyle}>Organization Name</label>
                      <input value={newInvoiceDetails.organization} onChange={(e) => setNewInvoiceDetails({ ...newInvoiceDetails, organization: e.target.value })} placeholder="Your organization (optional)" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Email Address *</label>
                      <input type="email" value={newInvoiceDetails.email} onChange={(e) => setNewInvoiceDetails({ ...newInvoiceDetails, email: e.target.value })} placeholder="your@email.com" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Phone Number *</label>
                      <input value={newInvoiceDetails.phone} onChange={(e) => setNewInvoiceDetails({ ...newInvoiceDetails, phone: e.target.value })} placeholder="+263 ..." style={inputStyle} />
                    </div>
                  </div>
                  {loginError && <p style={{ color: "#f87171", marginBottom: 16 }}>{loginError}</p>}
                  <button onClick={handleCreateNewInvoice} disabled={loading}
                    style={{ marginTop: 20, width: "100%", padding: "14px", background: "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "#fff", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
                    {loading ? "Creating..." : "➕ Create & Continue"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* PAYMENT STEP */}
          {step === "payment" && registration && (
            <div>
              <div style={{ background: "rgba(8,145,178,0.15)", border: "1px solid #0891b2", borderRadius: 12, padding: "16px 20px", marginBottom: 28 }}>
                <p style={{ margin: 0, color: "#7dd3fc", fontWeight: 600 }}>Welcome, {registration.fullName}</p>
                <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: 14 }}>{registration.organization ? `${registration.organization} · ` : ""}Email: {registration.email || "—"}</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

                {/* Summit Event Multi-Select */}
                <div style={{ gridColumn: "span 2" }}>
                  <label style={labelStyle}>Summit Event(s) * — Select one or both</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {/* Summit 1 */}
                    <div onClick={() => setSummit1Selected(!summit1Selected)}
                      style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 18px", borderRadius: 12,
                        background: summit1Selected ? "rgba(8,145,178,0.2)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${summit1Selected ? "#0891b2" : "rgba(255,255,255,0.12)"}`, cursor: "pointer", transition: "all .2s" }}>
                      <input type="checkbox" checked={summit1Selected} readOnly style={{ marginTop: 3, width: 18, height: 18, accentColor: "#0891b2" }} />
                      <div>
                        <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{SUMMIT_1.label}</div>
                        <div style={{ color: "#7dd3fc", fontSize: 13, marginTop: 2 }}>Full package price applies</div>
                      </div>
                    </div>

                    {/* Summit 2 */}
                    <div onClick={() => setSummit2Selected(!summit2Selected)}
                      style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 18px", borderRadius: 12,
                        background: summit2Selected ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${summit2Selected ? "#7c3aed" : "rgba(255,255,255,0.12)"}`, cursor: "pointer", transition: "all .2s" }}>
                      <input type="checkbox" checked={summit2Selected} readOnly style={{ marginTop: 3, width: 18, height: 18, accentColor: "#7c3aed" }} />
                      <div>
                        <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{SUMMIT_2.label}</div>
                        {bothSelected
                          ? <div style={{ color: "#a78bfa", fontSize: 13, marginTop: 2 }}>🎉 15% discount applied — {currency} {s2DiscountedPrice.toFixed(2)}/delegate (was {currency} {s2FullPrice.toFixed(2)})</div>
                          : <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 2 }}>Select both events to unlock 15% discount on this summit</div>
                        }
                      </div>
                    </div>

                    {/* Discount banner */}
                    {bothSelected && (
                      <div style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(8,145,178,0.25))", border: "1px solid rgba(124,58,237,0.5)", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 22 }}>🎉</span>
                        <div>
                           <div style={{ color: "#c4b5fd", fontWeight: 700, fontSize: 14 }}>Bundle Discount Active!</div>
                          <div style={{ color: "#a5f3fc", fontSize: 13 }}>15% off on "{SUMMIT_2.label}" — saving {currency} {(s2FullPrice * DISCOUNT_RATE * delegates).toFixed(2)} for {delegates} delegate{delegates > 1 ? "s" : ""}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Package */}
                <div style={{ gridColumn: "span 2" }}>
                  <label style={labelStyle}>Package Type *</label>
                  {PACKAGES.map((pkg) => (
                    <div key={pkg.id} onClick={() => setSelectedPkg(pkg)}
                      style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", marginBottom: 10, borderRadius: 10,
                        background: selectedPkg.id === pkg.id ? "rgba(30,64,175,0.3)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${selectedPkg.id === pkg.id ? "#3b82f6" : "rgba(255,255,255,0.1)"}`, cursor: "pointer" }}>
                      <input type="radio" checked={selectedPkg.id === pkg.id} readOnly style={{ marginTop: 2 }} />
                      <div>
                        <div style={{ color: "#fff", fontWeight: 600 }}>{pkg.label}</div>
                        <div style={{ color: "#34d399", fontWeight: 700, marginTop: 2 }}>
                          {currency} {pkg.price.toFixed(2)}/delegate per event
                          {bothSelected && <span style={{ color: "#a78bfa", marginLeft: 8 }}>({currency} {(pkg.price + pkg.price * (1 - DISCOUNT_RATE)).toFixed(2)}/delegate for both)</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delegates */}
                <div>
                  <label style={labelStyle}>Number of Delegates *</label>
                  <input type="number" min={1} value={delegates} onChange={(e) => setDelegates(parseInt(e.target.value) || 1)} style={inputStyle} />
                </div>

                {/* Currency */}
                <div>
                  <label style={labelStyle}>Currency *</label>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={selectStyle}>
                    <option value="USD">USD (US Dollar)</option>
                    <option value="ZWG">ZWG (Zimbabwe Gold)</option>
                  </select>
                </div>

                {/* Payment Method */}
                <div style={{ gridColumn: "span 2" }}>
                  <label style={labelStyle}>Payment Method *</label>
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={selectStyle}>
                    <option>Cash</option>
                    <option>Ecocash</option>
                    <option>Bank Transfer</option>
                  </select>

                  {/* Cash Info */}
                  {paymentMethod === "Cash" && (
                    <div style={{ marginTop: 14, background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 12, padding: "16px 20px" }}>
                      <div style={{ color: "#fbbf24", fontWeight: 700, fontSize: 15, marginBottom: 10 }}>🏢 Cash Payment Options</div>
                      <div style={{ color: "#fde68a", fontSize: 14, lineHeight: 1.7 }}>
                        <div><strong>Visit our offices:</strong></div>
                        <div style={{ marginLeft: 12, marginBottom: 10 }}>📍 Number 275 Herbert Chitepo Avenue, Harare, Zimbabwe</div>
                        <div><strong>Or deposit at bank:</strong></div>
                        <div style={{ marginLeft: 12 }}>🏦 <strong>ZB Bank</strong> — USD Account</div>
                        <div style={{ marginLeft: 12 }}>Account Name: <strong>Artificial Intelligence Initiative Africa</strong></div>
                        <div style={{ marginLeft: 12 }}>Account Number: <strong>413001228226400</strong></div>
                        <div style={{ marginLeft: 12, marginTop: 8 }}>🏦 <strong>AFC HOLDINGS Bank</strong></div>
                        <div style={{ marginLeft: 12 }}>Account Name: <strong>AI INITIATIVE AFRICA PVT LTD</strong></div>
                        <div style={{ marginLeft: 12 }}>Account Number: <strong>1014884111301-USD</strong></div>
                      </div>
                    </div>
                  )}

                  {/* Ecocash Info */}
                  {paymentMethod === "Ecocash" && (
                    <div style={{ marginTop: 14, background: "rgba(5,150,105,0.12)", border: "1px solid rgba(5,150,105,0.4)", borderRadius: 12, padding: "16px 20px" }}>
                      <div style={{ color: "#34d399", fontWeight: 700, fontSize: 15, marginBottom: 10 }}>📱 Ecocash Payment Details</div>
                      <div style={{ color: "#a7f3d0", fontSize: 14, lineHeight: 1.8 }}>
                        <div>📞 Send to number: <strong style={{ fontSize: 18, color: "#6ee7b7" }}>0786 641 792</strong></div>
                        <div>👤 Registered Name: <strong>Dennis Magaya</strong></div>
                        <div style={{ marginTop: 8, color: "#94a3b8", fontSize: 13 }}>Please use your Invoice Number as the payment reference/note.</div>
                      </div>
                    </div>
                  )}

                  {/* Bank Transfer Info */}
                  {paymentMethod === "Bank Transfer" && (
                    <div style={{ marginTop: 14, background: "rgba(30,64,175,0.15)", border: "1px solid rgba(59,130,246,0.4)", borderRadius: 12, padding: "16px 20px" }}>
                      <div style={{ color: "#93c5fd", fontWeight: 700, fontSize: 15, marginBottom: 10 }}>🏦 Bank Transfer Details</div>
                      <div style={{ color: "#bfdbfe", fontSize: 14, lineHeight: 1.8 }}>
                        <div>Bank: <strong>ZB Bank — USD Account</strong></div>
                        <div>Account Name: <strong>Artificial Intelligence Initiative Africa</strong></div>
                        <div>Account Number: <strong>413001228226400</strong></div>
                        <div style={{ marginTop: 10 }}>Bank: <strong>AFC HOLDINGS Bank</strong></div>
                        <div>Account Name: <strong>AI INITIATIVE AFRICA PVT LTD</strong></div>
                        <div>Account Number: <strong>1014884111301-USD</strong></div>
                        <div style={{ marginTop: 8, color: "#94a3b8", fontSize: 13 }}>Please use your Invoice Number as the payment reference.</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Address */}
                <div style={{ gridColumn: "span 2" }}>
                  <label style={labelStyle}>Billing Address</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} style={inputStyle} placeholder="Enter your full billing address" />
                </div>
              </div>

              {/* Total preview */}
              {bothSelected ? (
                <div style={{ marginTop: 24, padding: "18px 20px", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.4)", borderRadius: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ color: "#94a3b8" }}>{SUMMIT_1.label} — {delegates} delegate{delegates > 1 ? "s" : ""}</span>
                    <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{currency} {(s1Price * delegates).toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ color: "#94a3b8" }}>{SUMMIT_2.label} — {delegates} delegate{delegates > 1 ? "s" : ""} <span style={{ color: "#a78bfa" }}>(15% off)</span></span>
                    <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{currency} {(s2DiscountedPrice * delegates).toFixed(2)}</span>
                  </div>
                  <div style={{ borderTop: "1px solid rgba(52,211,153,0.3)", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#94a3b8", fontWeight: 600 }}>Grand Total</span>
                    <span style={{ color: "#34d399", fontSize: 28, fontWeight: 800 }}>{currency} {grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: 24, padding: "16px 20px", background: "rgba(52,211,153,0.1)", border: "1px solid #34d399", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#94a3b8", fontWeight: 600 }}>Total Amount ({delegates} delegate{delegates > 1 ? "s" : ""})</span>
                  <span style={{ color: "#34d399", fontSize: 28, fontWeight: 800 }}>{currency} {grandTotal.toFixed(2)}</span>
                </div>
              )}

              <button onClick={handleGenerateInvoice} disabled={loading || (!summit1Selected && !summit2Selected)}
                style={{ marginTop: 24, width: "100%", padding: "16px", background: (!summit1Selected && !summit2Selected) ? "rgba(100,100,100,0.3)" : "linear-gradient(135deg, #1e40af, #7c3aed)", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: (!summit1Selected && !summit2Selected) ? "not-allowed" : "pointer" }}>
                {loading ? "Generating..." : "🧾 Generate Invoice"}
              </button>
              <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 8, textAlign: "center" }}>
                Note: Unique Invoice and Registration numbers will be automatically generated upon submission.
              </div>
            </div>
          )}

          {/* INVOICE STEP */}
          {step === "invoice" && invoice && (
            <div>
              {!invoiceEditMode ? (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <h2 style={{ color: "#fff", margin: 0 }}>Your Invoice</h2>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={handleEditInvoice}
                      style={{ padding: "10px 20px", background: "#f59e0b", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>
                      ✏️ Edit Invoice
                    </button>
                    <button onClick={handleDownloadPDF}
                      style={{ padding: "10px 20px", background: "#1e40af", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>
                      ⬇ Download PDF
                    </button>
                    <button onClick={() => setStep("proof")}
                      style={{ padding: "10px 20px", background: "#059669", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>
                      Next: Submit Payment →
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <h2 style={{ color: "#fff", margin: 0 }}>Edit Invoice Details</h2>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => setInvoiceEditMode(false)}
                      style={{ padding: "10px 20px", background: "#666", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>
                      Cancel
                    </button>
                    <button onClick={handleSaveInvoiceChanges}
                      style={{ padding: "10px 20px", background: "#059669", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>
                      💾 Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/* Invoice edit form */}
              {invoiceEditMode && editInvoiceData && (
                <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "24px", marginBottom: 24 }}>
                  <h3 style={{ color: "#fff", marginTop: 0, marginBottom: 16 }}>Update Billing Information</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div style={{ gridColumn: "span 2" }}>
                      <label style={labelStyle}>Full Name</label>
                      <input value={editInvoiceData.fullName} onChange={(e) => setEditInvoiceData({ ...editInvoiceData, fullName: e.target.value })} style={inputStyle} />
                    </div>
                    <div style={{ gridColumn: "span 2" }}>
                      <label style={labelStyle}>Organization Name</label>
                      <input value={editInvoiceData.organization} onChange={(e) => setEditInvoiceData({ ...editInvoiceData, organization: e.target.value })} style={inputStyle} />
                    </div>
                    <div style={{ gridColumn: "span 2" }}>
                      <label style={labelStyle}>Address</label>
                      <input value={editInvoiceData.address} onChange={(e) => setEditInvoiceData({ ...editInvoiceData, address: e.target.value })} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Phone Number</label>
                      <input value={editInvoiceData.phone} onChange={(e) => setEditInvoiceData({ ...editInvoiceData, phone: e.target.value })} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Email Address</label>
                      <input value={editInvoiceData.email} onChange={(e) => setEditInvoiceData({ ...editInvoiceData, email: e.target.value })} style={inputStyle} />
                    </div>
                    <div style={{ gridColumn: "span 2" }}>
                      <label style={labelStyle}>Payment Method</label>
                      <input value={editInvoiceData.paymentMethod} onChange={(e) => setEditInvoiceData({ ...editInvoiceData, paymentMethod: e.target.value })} style={inputStyle} />
                    </div>
                  </div>
                </div>
              )}

              {/* Invoice printable area */}
              <div ref={invoiceRef} style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", color: "#111", fontSize: 13 }}>
                {/* Invoice Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#1e40af", marginBottom: 2 }}>· Invoice</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>Invoice Number: <strong>{invoice.invoiceNumber}</strong></div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>Registration Number: <strong>{getRegistrationNumber(invoice.referenceNumber, invoice.summitEvent)}</strong></div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700, fontSize: 12 }}>Artificial Intelligence Initiative Africa</div>
                    <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.4 }}>
                      275 Herbert Chitepo Ave, Harare, Zimbabwe<br />
                      +263 78 6434 988<br />
                      admin@aiinstituteafrica.com<br />
                      www.aiinstituteafrica.com
                    </div>
                  </div>
                </div>
                <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", marginBottom: 14 }} />

                {/* Bill To */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 13 }}>Bill To:</div>
                  <div style={{ fontSize: 12, lineHeight: 1.3 }}><strong>Date:</strong> {today}</div>
                  <div style={{ fontSize: 12, lineHeight: 1.3 }}><strong>Name:</strong> {invoice.fullName}</div>
                  <div style={{ fontSize: 12, lineHeight: 1.3 }}><strong>Org:</strong> {invoice.organization || "—"}</div>
                  <div style={{ fontSize: 12, lineHeight: 1.3 }}><strong>Address:</strong> {invoice.address || "—"}</div>
                  <div style={{ fontSize: 12, lineHeight: 1.3 }}><strong>Phone:</strong> {invoice.phone || "—"}</div>
                  <div style={{ fontSize: 12, lineHeight: 1.3 }}><strong>Email:</strong> {invoice.email}</div>
                  <div style={{ fontSize: 12, lineHeight: 1.3 }}><strong>Payment:</strong> {invoice.paymentMethod}</div>
                </div>

                {/* Event */}
                <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 12 }}>Event Name(s): {invoice.summitEvent}</div>

                {/* Table */}
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12, fontSize: 11 }}>
                  <thead>
                    <tr style={{ background: "#111", color: "#fff" }}>
                      <th style={{ padding: "6px 8px", textAlign: "left", border: "1px dashed #555", fontSize: 11 }}>Description</th>
                      <th style={{ padding: "6px 8px", textAlign: "center", border: "1px dashed #555", fontSize: 11 }}>Unit Price ({invoice.currency})</th>
                      <th style={{ padding: "6px 8px", textAlign: "center", border: "1px dashed #555", fontSize: 11 }}>Delegates</th>
                      <th style={{ padding: "6px 8px", textAlign: "center", border: "1px dashed #555", fontSize: 11 }}>Sub-Total ({invoice.currency})</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Row 1: Show appropriate event based on selection */}
                    <tr>
                      <td style={{ padding: "6px 8px", border: "1px dashed #ccc" }}>
                        <strong style={{ fontSize: 11 }}>{summit1Selected && !summit2Selected ? `${SUMMIT_1.name}: ${SUMMIT_1.dates}` : summit2Selected && !summit1Selected ? `${SUMMIT_2.name}: ${SUMMIT_2.dates}` : `${SUMMIT_1.name}: ${SUMMIT_1.dates}`}</strong><br />
                        <span style={{ fontSize: 10, color: "#6b7280" }}>{invoice.packageDescription}</span>
                      </td>
                      <td style={{ padding: "6px 8px", textAlign: "center", border: "1px dashed #ccc" }}>{parseFloat(invoice.packagePrice).toFixed(2)}</td>
                      <td style={{ padding: "6px 8px", textAlign: "center", border: "1px dashed #ccc" }}>{invDelegates}</td>
                      <td style={{ padding: "6px 8px", textAlign: "center", border: "1px dashed #ccc" }}>{(parseFloat(invoice.packagePrice) * invDelegates).toFixed(2)}</td>
                    </tr>

                    {/* Row 2: Event 2 (only if dual event) */}
                    {invoiceIsDual && parseFloat(invoice.secondEventPrice || 0) > 0 && (
                      <tr>
                        <td style={{ padding: "6px 8px", border: "1px dashed #ccc" }}>
                          <strong style={{ fontSize: 11 }}>{SUMMIT_2.name}: {SUMMIT_2.dates}</strong><br />
                          <span style={{ fontSize: 10, color: "#6b7280" }}>{invoice.packageDescription}</span><br />
                          <span style={{ fontSize: 10, color: "#7c3aed", fontWeight: 600 }}>✦ 15% Bundle Discount Applied</span>
                        </td>
                        <td style={{ padding: "6px 8px", textAlign: "center", border: "1px dashed #ccc" }}>
                          <span style={{ textDecoration: "line-through", color: "#9ca3af", fontSize: 10, display: "block" }}>{parseFloat(invoice.packagePrice).toFixed(2)}</span>
                          {parseFloat(invoice.secondEventPrice).toFixed(2)}
                        </td>
                        <td style={{ padding: "6px 8px", textAlign: "center", border: "1px dashed #ccc" }}>{invDelegates}</td>
                        <td style={{ padding: "6px 8px", textAlign: "center", border: "1px dashed #ccc" }}>{(parseFloat(invoice.secondEventPrice) * invDelegates).toFixed(2)}</td>
                      </tr>
                    )}

                    {/* Total row */}
                    <tr style={{ fontWeight: 700 }}>
                      <td colSpan={3} style={{ padding: "6px 8px", border: "1px dashed #ccc" }}>Total</td>
                      <td style={{ padding: "6px 8px", textAlign: "center", border: "1px dashed #ccc" }}>{invoice.currency} {parseFloat(invoice.totalAmount).toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Signature + Bank */}
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 11 }}>Authorized Signature (Ms. Mupikeni) AI Institute Administrator</div>
                  <img src={signatureUrl} alt="Signature" style={{ height: 35, objectFit: "contain", marginTop: 2, display: "block" }} />
                </div>
                <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", marginBottom: 8 }} />
                <div style={{ fontWeight: 700, marginBottom: 3, fontSize: 11 }}>Bank Name: ZB Bank</div>
                <div style={{ marginBottom: 2, fontSize: 11 }}><strong>Account Name:</strong> Artificial Intelligence Initiative Africa</div>
                <div style={{ marginBottom: 2, fontSize: 11 }}><strong>Account Number:</strong> 413001228226400</div>
                <div style={{ fontWeight: 700, marginBottom: 2, marginTop: 4, fontSize: 11 }}>Bank Name: AFC HOLDINGS Bank</div>
                <div style={{ marginBottom: 2, fontSize: 11 }}><strong>Account Name:</strong> AI INITIATIVE AFRICA PVT LTD</div>
                <div style={{ marginBottom: 6, fontSize: 11 }}><strong>Account Number:</strong> 1014884111301-USD</div>
                <div style={{ fontWeight: 700, marginBottom: 2, fontSize: 11 }}>Payment Terms:</div>
                <div style={{ fontSize: 11, lineHeight: 1.3 }}>• Kindly note that the Payment should be made at the latest by <strong>8 June 2026</strong></div>
                <div style={{ fontSize: 11, lineHeight: 1.3 }}>• Please use the invoice number as payment reference</div>
              </div>
            </div>
          )}

          {/* PAYMENT PROOF STEP */}
          {step === "proof" && registration && (
            <div>
              <h2 style={{ color: "#fff", marginTop: 0 }}>Submit Payment Proof</h2>
              <p style={{ color: "#94a3b8", marginBottom: 28 }}>Once you have made payment, please fill in the details below.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                <div style={{ gridColumn: "span 2" }}>
                  <label style={labelStyle}>Full Name / Organization *</label>
                  <input value={payerName} onChange={(e) => setPayerName(e.target.value)} placeholder="Name of person or organization that paid" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Payment Reference *</label>
                  <input value={paymentRef} onChange={(e) => setPaymentRef(e.target.value)} placeholder="e.g. TXN123456" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Date of Payment *</label>
                  <input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} style={inputStyle} />
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <label style={labelStyle}>Where Payment Was Made *</label>
                  <input value={paymentLocation} onChange={(e) => setPaymentLocation(e.target.value)} placeholder="e.g. ZB Bank, Ecocash, Cash at office" style={inputStyle} />
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <label style={labelStyle}>Upload Payment Proof (optional)</label>
                  <div style={{ border: "2px dashed rgba(255,255,255,0.2)", borderRadius: 10, padding: "20px", textAlign: "center", cursor: "pointer", background: "rgba(255,255,255,0.03)" }}
                    onClick={() => document.getElementById("proof-file")?.click()}>
                    <input id="proof-file" type="file" style={{ display: "none" }} accept="image/*,.pdf" onChange={(e) => setProofFile(e.target.files?.[0] || null)} />
                    <div style={{ color: "#94a3b8" }}>{proofFile ? `✅ ${proofFile.name}` : "📎 Click to upload receipt / screenshot (PDF or image)"}</div>
                  </div>
                </div>
              </div>
              <button onClick={handleSubmitProof} disabled={loading}
                style={{ marginTop: 24, width: "100%", padding: "16px", background: "linear-gradient(135deg, #059669, #0d9488)", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
                {loading ? "Submitting..." : "✅ Submit Payment Proof"}
              </button>
            </div>
          )}

          {/* DELEGATES STEP */}
          {step === "delegates" && registration && (
            <div>
              <h2 style={{ color: "#fff", marginTop: 0 }}>Delegate List</h2>
              <p style={{ color: "#94a3b8", marginBottom: 28 }}>Please provide the names of all delegates attending the summit.</p>

              {delegateNames.map((name, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  <input value={name} onChange={(e) => { const arr = [...delegateNames]; arr[i] = e.target.value; setDelegateNames(arr); }}
                    placeholder={`Delegate ${i + 1} full name`} style={{ ...inputStyle, flex: 1 }} />
                  {delegateNames.length > 1 && (
                    <button onClick={() => setDelegateNames(delegateNames.filter((_, j) => j !== i))}
                      style={{ background: "#dc2626", color: "#fff", border: "none", borderRadius: 8, padding: "0 16px", cursor: "pointer", fontWeight: 700 }}>✕</button>
                  )}
                </div>
              ))}

              <button onClick={() => setDelegateNames([...delegateNames, ""])}
                style={{ marginTop: 4, padding: "10px 20px", background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
                + Add Delegate
              </button>

              <button onClick={handleSubmitDelegates} disabled={loading}
                style={{ marginTop: 20, width: "100%", padding: "16px", background: "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
                {loading ? "Submitting..." : "👥 Submit Delegate List"}
              </button>
            </div>
          )}

          {/* SUMMARY STEP */}
          {step === "summary" && registration && invoice && (
            <div>
              <h2 style={{ color: "#fff", marginTop: 0 }}>Portal Home</h2>
              <p style={{ color: "#94a3b8", marginBottom: 28 }}>Here is your registration summary and payment receipt.</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
                <div style={{ background: "rgba(255,255,255,0.05)", padding: 20, borderRadius: 12 }}>
                  <h3 style={{ color: "#fff", marginTop: 0, marginBottom: 12 }}>Registration Summary</h3>
                  <div style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
                    <div><strong>Event:</strong> {invoice.summitEvent}</div>
                    <div><strong>Package:</strong> {invoice.packageDescription}</div>
                    <div><strong>Delegates:</strong> {invoice.numberOfDelegates}</div>
                    <div style={{ marginTop: 8 }}><strong>Total Paid:</strong> <span style={{ color: "#34d399", fontWeight: 700 }}>{invoice.currency} {parseFloat(invoice.totalAmount).toFixed(2)}</span></div>
                  </div>
                </div>

                <div style={{ background: "rgba(255,255,255,0.05)", padding: 20, borderRadius: 12 }}>
                  <h3 style={{ color: "#fff", marginTop: 0, marginBottom: 12 }}>Delegate List</h3>
                  <ul style={{ color: "#cbd5e1", margin: 0, paddingLeft: 20, lineHeight: 1.6 }}>
                    {delegateNames.filter((n) => n.trim()).map((name, i) => (
                      <li key={i}>{name}</li>
                    ))}
                    {delegateNames.filter((n) => n.trim()).length === 0 && <li>No delegates added yet.</li>}
                  </ul>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h3 style={{ color: "#fff", margin: 0 }}>Payment Receipt</h3>
                <button onClick={handleDownloadReceiptPDF}
                  style={{ padding: "10px 20px", background: "#059669", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>
                  ⬇ Download Receipt
                </button>
              </div>

              {/* Receipt printable area */}
              <div ref={receiptRef} style={{ background: "#fff", borderRadius: 12, padding: "40px 48px", color: "#111" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
                  <div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: "#059669", marginBottom: 4 }}>· Receipt</div>
                    <div style={{ fontSize: 14, color: "#6b7280" }}>Receipt Number: <strong>RC-{invoice.invoiceNumber.replace("SN-", "")}</strong></div>
                    <div style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>Registration Number: <strong>{getRegistrationNumber(invoice.referenceNumber, invoice.summitEvent)}</strong></div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <img src={logoUrl} alt="AIIA" style={{ height: 100, objectFit: "contain", marginBottom: 12 }} onError={(e) => (e.currentTarget.style.display = "none")} />
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
                  <div><strong>Date:</strong> {paymentDate || today}</div>
                  <div style={{ marginTop: 8 }}><strong>Name:</strong> {invoice.fullName}</div>
                  <div><strong>Registration Number:</strong> {getRegistrationNumber(invoice.referenceNumber, invoice.summitEvent)}</div>
                  <div><strong>Organization Name:</strong> {invoice.organization || "—"}</div>
                  <div><strong>Address:</strong> {invoice.address || "—"}</div>
                  <div><strong>Payment Method:</strong> {paymentLocation || invoice.paymentMethod}</div>
                  <div><strong>Payment Reference:</strong> {paymentRef || "—"}</div>
                </div>
                <div style={{ fontWeight: 700, marginBottom: 12 }}>Event Name(s): {invoice.summitEvent}</div>
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 28 }}>
                  <thead>
                    <tr style={{ background: "#111", color: "#fff" }}>
                      <th style={{ padding: "12px 14px", textAlign: "left", border: "1px dashed #555" }}>Description</th>
                      <th style={{ padding: "12px 14px", textAlign: "center", border: "1px dashed #555" }}>Amount ({invoice.currency})</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: "14px", border: "1px dashed #ccc" }}>{invoice.packageDescription} ({invoice.numberOfDelegates} Delegates)</td>
                      <td style={{ padding: "14px", textAlign: "center", border: "1px dashed #ccc" }}>{parseFloat(invoice.totalAmount).toFixed(2)}</td>
                    </tr>
                    <tr style={{ fontWeight: 800 }}>
                      <td style={{ padding: "14px", textAlign: "right", border: "1px dashed #ccc" }}>TOTAL PAID:</td>
                      <td style={{ padding: "14px", textAlign: "center", border: "1px dashed #ccc", color: "#059669" }}>{parseFloat(invoice.totalAmount).toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
                <div style={{ marginBottom: 24 }}>
                  <div>Authorized Signature (Ms. Mupikeni) AI Institute Administrator</div>
                  <img src={signatureUrl} alt="Signature" style={{ height: 60, objectFit: "contain", marginTop: 4, display: "block" }} />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = { color: "#cbd5e1", fontWeight: 600, display: "block", marginBottom: 8, fontSize: 14 };
const inputStyle: React.CSSProperties = { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.07)", color: "#fff", fontSize: 15, outline: "none", boxSizing: "border-box" };
const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer" };
