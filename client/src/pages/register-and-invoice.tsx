import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  FileText,
  Download,
  Loader2,
  ArrowLeft,
  CheckCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  DollarSign,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface RegistrationData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  organization: string;
  address: string;
  notes: string;
}

interface InvoiceData {
  numberOfDelegates: string;
  packageType: string;
  packageDescription: string;
  packagePrice: string;
  paymentMethod: string;
  currency: string;
  summitEvent: string;
}

interface GeneratedInvoice {
  referenceNumber: string;
  invoiceNumber: string;
  fullName: string;
  email: string;
  phone: string;
  organization?: string;
  address: string;
  paymentMethod: string;
  currency: string;
  numberOfDelegates: number;
  packageType: string;
  packageDescription: string;
  packagePrice: string;
  totalAmount: string;
  summitEvent: string;
  createdAt: string;
}

export default function RegisterAndInvoice() {
  const { toast } = useToast();
  const [step, setStep] = useState<"register" | "invoice" | "completed">("register");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [generatedInvoice, setGeneratedInvoice] = useState<GeneratedInvoice | null>(null);

  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    organization: "",
    address: "",
    notes: "",
  });

  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    numberOfDelegates: "1",
    packageType: "standard",
    packageDescription: "Standard Package",
    packagePrice: "500",
    paymentMethod: "bank_transfer",
    currency: "USD",
    summitEvent: "AI Africa Summit 2025",
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async () => {
      // Validate required fields
      if (
        !registrationData.fullName ||
        !registrationData.email ||
        !registrationData.phone ||
        !registrationData.country ||
        !registrationData.address
      ) {
        throw new Error("Please fill in all required fields");
      }

      const response = await fetch("/api/summit-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...registrationData,
          selectedSummits: [{ title: "AI Africa Summit 2025" }],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to register");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setReferenceNumber(data.referenceNumber);
      toast({
        title: "Registration Successful",
        description: `Reference: ${data.referenceNumber}`,
      });
      setStep("invoice");
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Generate invoice mutation
  const generateInvoiceMutation = useMutation({
    mutationFn: async () => {
      const totalAmount = (
        parseFloat(invoiceData.packagePrice) * parseInt(invoiceData.numberOfDelegates)
      ).toFixed(2);

      const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

      const invoice: GeneratedInvoice = {
        referenceNumber,
        invoiceNumber,
        fullName: registrationData.fullName,
        email: registrationData.email,
        phone: registrationData.phone,
        organization: registrationData.organization || undefined,
        address: registrationData.address,
        paymentMethod: invoiceData.paymentMethod,
        currency: invoiceData.currency,
        numberOfDelegates: parseInt(invoiceData.numberOfDelegates),
        packageType: invoiceData.packageType,
        packageDescription: invoiceData.packageDescription,
        packagePrice: invoiceData.packagePrice,
        totalAmount,
        summitEvent: invoiceData.summitEvent,
        createdAt: new Date().toISOString(),
      };

      return invoice;
    },
    onSuccess: (invoice) => {
      setGeneratedInvoice(invoice);
      toast({
        title: "Invoice Generated",
        description: `Invoice #${invoice.invoiceNumber} created successfully`,
      });
      setStep("completed");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleRegInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setRegistrationData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInvInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setInvoiceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate();
  };

  const handleInvSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateInvoiceMutation.mutate();
  };

  const handleDownload = () => {
    if (!generatedInvoice) return;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${generatedInvoice.invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
          .header { text-align: center; margin-bottom: 40px; }
          .logo { font-size: 28px; font-weight: bold; color: #0891b2; margin-bottom: 10px; }
          .invoice-title { font-size: 24px; font-weight: bold; margin-bottom: 30px; }
          .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
          .detail-section h3 { font-size: 12px; font-weight: bold; color: #999; margin-bottom: 10px; }
          .detail-section p { margin: 5px 0; }
          table { width: 100%; border-collapse: collapse; margin: 30px 0; }
          th { background: #f0f0f0; padding: 12px; text-align: left; font-weight: bold; border-bottom: 2px solid #ddd; }
          td { padding: 12px; border-bottom: 1px solid #eee; }
          .total-section { text-align: right; margin-top: 30px; }
          .total-amount { font-size: 24px; font-weight: bold; color: #0891b2; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">AI Institute Africa</div>
          <div class="invoice-title">INVOICE</div>
        </div>

        <div class="details-grid">
          <div class="detail-section">
            <h3>INVOICE DETAILS</h3>
            <p><strong>Invoice Number:</strong> ${generatedInvoice.invoiceNumber}</p>
            <p><strong>Reference:</strong> ${generatedInvoice.referenceNumber}</p>
            <p><strong>Date:</strong> ${new Date(generatedInvoice.createdAt).toLocaleDateString()}</p>
            <p><strong>Event:</strong> ${generatedInvoice.summitEvent}</p>
            <p><strong>Payment Method:</strong> ${generatedInvoice.paymentMethod.replace("_", " ").toUpperCase()}</p>
          </div>

          <div class="detail-section">
            <h3>BILLING TO</h3>
            <p><strong>${generatedInvoice.fullName}</strong></p>
            ${generatedInvoice.organization ? `<p>${generatedInvoice.organization}</p>` : ""}
            <p>${generatedInvoice.address}</p>
            <p>Email: ${generatedInvoice.email}</p>
            <p>Phone: ${generatedInvoice.phone}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${generatedInvoice.packageDescription}</td>
              <td>${generatedInvoice.numberOfDelegates}</td>
              <td>${generatedInvoice.currency} ${generatedInvoice.packagePrice}</td>
              <td>${generatedInvoice.currency} ${generatedInvoice.totalAmount}</td>
            </tr>
          </tbody>
        </table>

        <div class="total-section">
          <p>Subtotal: ${generatedInvoice.currency} ${generatedInvoice.totalAmount}</p>
          <p class="total-amount">Total Due: ${generatedInvoice.currency} ${generatedInvoice.totalAmount}</p>
        </div>

        <div class="footer">
          <p>Thank you for your business!</p>
          <p>Payment terms: Due upon receipt</p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: "text/html" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Invoice_${generatedInvoice.invoiceNumber}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <div className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back Home
          </div>
        </Link>

        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-2xl p-8 shadow-lg mb-8">
          <h1 className="text-3xl font-bold mb-2">Register & Generate Invoice</h1>
          <p className="text-cyan-100">
            {step === "register"
              ? "Step 1: Register for the summit"
              : step === "invoice"
              ? "Step 2: Generate your invoice"
              : "Registration and Invoice Complete"}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex gap-4 mb-8">
          <div
            className={`flex-1 p-4 rounded-lg border-2 ${
              step === "register"
                ? "border-cyan-600 bg-cyan-50 dark:bg-cyan-900/20"
                : "border-green-600 bg-green-50 dark:bg-green-900/20"
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                  step === "register" ? "bg-cyan-600" : "bg-green-600"
                }`}
              >
                {step !== "register" ? "✓" : "1"}
              </div>
              <span className="font-semibold">Register</span>
            </div>
          </div>

          <div
            className={`flex-1 p-4 rounded-lg border-2 ${
              step === "invoice" || step === "completed"
                ? step === "invoice"
                  ? "border-cyan-600 bg-cyan-50 dark:bg-cyan-900/20"
                  : "border-green-600 bg-green-50 dark:bg-green-900/20"
                : "border-gray-300 dark:border-gray-700 opacity-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                  step === "invoice" || step === "completed"
                    ? step === "completed"
                      ? "bg-green-600"
                      : "bg-cyan-600"
                    : "bg-gray-400"
                }`}
              >
                {step === "completed" ? "✓" : "2"}
              </div>
              <span className="font-semibold">Invoice</span>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        {step === "register" && (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold mb-6">Summit Registration</h2>
            <form onSubmit={handleRegSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={registrationData.fullName}
                    onChange={handleRegInputChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={registrationData.email}
                    onChange={handleRegInputChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={registrationData.phone}
                    onChange={handleRegInputChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                    placeholder="+1234567890"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={registrationData.country}
                    onChange={handleRegInputChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                    placeholder="Zimbabwe"
                  />
                </div>

                {/* Organization */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Organization
                  </label>
                  <input
                    type="text"
                    name="organization"
                    value={registrationData.organization}
                    onChange={handleRegInputChange}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                    placeholder="Company Name"
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Billing Address *
                  </label>
                  <textarea
                    name="address"
                    value={registrationData.address}
                    onChange={handleRegInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                    placeholder="Street address, City, Country"
                  />
                </div>

                {/* Notes */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={registrationData.notes}
                    onChange={handleRegInputChange}
                    rows={2}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                    placeholder="Any additional information..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition disabled:opacity-50 flex items-center justify-center gap-2 font-semibold"
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Register & Continue
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Invoice Form */}
        {step === "invoice" && (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold mb-2">Generate Invoice</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Reference: <span className="font-mono font-bold text-cyan-600">{referenceNumber}</span>
            </p>

            <form onSubmit={handleInvSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Number of Delegates */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Number of Delegates
                  </label>
                  <input
                    type="number"
                    name="numberOfDelegates"
                    value={invoiceData.numberOfDelegates}
                    onChange={handleInvInputChange}
                    min="1"
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                </div>

                {/* Package Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Package Type
                  </label>
                  <select
                    name="packageType"
                    value={invoiceData.packageType}
                    onChange={handleInvInputChange}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                  >
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                    <option value="vip">VIP</option>
                  </select>
                </div>

                {/* Price per Delegate */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price per Delegate
                  </label>
                  <input
                    type="number"
                    name="packagePrice"
                    value={invoiceData.packagePrice}
                    onChange={handleInvInputChange}
                    step="0.01"
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                </div>

                {/* Currency */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={invoiceData.currency}
                    onChange={handleInvInputChange}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="ZWL">ZWL</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>

                {/* Package Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Package Description
                  </label>
                  <textarea
                    name="packageDescription"
                    value={invoiceData.packageDescription}
                    onChange={handleInvInputChange}
                    rows={2}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg p-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Estimated Total:
                </p>
                <p className="text-3xl font-bold text-cyan-600">
                  {invoiceData.currency}{" "}
                  {(
                    parseFloat(invoiceData.packagePrice) *
                    parseInt(invoiceData.numberOfDelegates)
                  ).toFixed(2)}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={generateInvoiceMutation.isPending}
                  className="flex-1 px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition disabled:opacity-50 flex items-center justify-center gap-2 font-semibold"
                >
                  {generateInvoiceMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5" />
                      Generate Invoice
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("register");
                    setRegistrationData({
                      fullName: "",
                      email: "",
                      phone: "",
                      country: "",
                      organization: "",
                      address: "",
                      notes: "",
                    });
                  }}
                  className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition font-semibold"
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Completed */}
        {step === "completed" && generatedInvoice && (
          <div className="space-y-6">
            {/* Success Message */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-green-600 mb-2">
                Registration & Invoice Complete!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Your registration and invoice have been generated successfully.
              </p>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Reference Number:</span>{" "}
                  <span className="font-mono text-cyan-600">{generatedInvoice.referenceNumber}</span>
                </p>
                <p>
                  <span className="font-semibold">Invoice Number:</span>{" "}
                  <span className="font-mono text-cyan-600">{generatedInvoice.invoiceNumber}</span>
                </p>
              </div>
            </div>

            {/* Invoice Display */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <FileText className="w-6 h-6 text-cyan-600" />
                  Invoice #{generatedInvoice.invoiceNumber}
                </h2>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    INVOICE DETAILS
                  </p>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-semibold">Invoice:</span>{" "}
                      {generatedInvoice.invoiceNumber}
                    </p>
                    <p>
                      <span className="font-semibold">Reference:</span>{" "}
                      {generatedInvoice.referenceNumber}
                    </p>
                    <p>
                      <span className="font-semibold">Date:</span>{" "}
                      {new Date(generatedInvoice.createdAt).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-semibold">Event:</span>{" "}
                      {generatedInvoice.summitEvent}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    BILLING TO
                  </p>
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold">{generatedInvoice.fullName}</p>
                    {generatedInvoice.organization && (
                      <p>{generatedInvoice.organization}</p>
                    )}
                    <p>{generatedInvoice.address}</p>
                    <p>{generatedInvoice.email}</p>
                    <p>{generatedInvoice.phone}</p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto mb-8">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-800">
                    <tr>
                      <th className="text-left px-4 py-2 font-semibold">
                        Description
                      </th>
                      <th className="text-right px-4 py-2 font-semibold">
                        Qty
                      </th>
                      <th className="text-right px-4 py-2 font-semibold">
                        Unit Price
                      </th>
                      <th className="text-right px-4 py-2 font-semibold">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <td className="px-4 py-3">
                        {generatedInvoice.packageDescription}
                      </td>
                      <td className="text-right px-4 py-3">
                        {generatedInvoice.numberOfDelegates}
                      </td>
                      <td className="text-right px-4 py-3">
                        {generatedInvoice.currency}{" "}
                        {generatedInvoice.packagePrice}
                      </td>
                      <td className="text-right px-4 py-3 font-semibold">
                        {generatedInvoice.currency}{" "}
                        {generatedInvoice.totalAmount}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <div className="w-64 p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800">
                  <div className="flex justify-between mb-2 text-sm">
                    <span>Subtotal:</span>
                    <span>
                      {generatedInvoice.currency}{" "}
                      {generatedInvoice.totalAmount}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-cyan-200 dark:border-cyan-800 pt-2">
                    <span>Total Due:</span>
                    <span className="text-cyan-600">
                      {generatedInvoice.currency}{" "}
                      {generatedInvoice.totalAmount}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setStep("register");
                  setRegistrationData({
                    fullName: "",
                    email: "",
                    phone: "",
                    country: "",
                    organization: "",
                    address: "",
                    notes: "",
                  });
                  setInvoiceData({
                    numberOfDelegates: "1",
                    packageType: "standard",
                    packageDescription: "Standard Package",
                    packagePrice: "500",
                    paymentMethod: "bank_transfer",
                    currency: "USD",
                    summitEvent: "AI Africa Summit 2025",
                  });
                }}
                className="flex-1 px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition font-semibold"
              >
                Register Another Person
              </button>
              <Link href="/">
                <button className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition font-semibold">
                  Back Home
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
