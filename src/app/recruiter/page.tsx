"use client";
import {
  Building,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Plus,
  Eye,
  Edit,
  Trash2,
  Star,
  TrendingUp,
  Search,
  CheckCircle,
  Brain,
  X,
} from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

// Define types
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary_min: number;
  salary_max: number;
  description: string;
  tags: string;
  recruiter_id: string;
  salary?: string;
  posted?: string;
  applicants?: string;
  status?: string;
  views?: number;
  companyColor?: string;
  logo?: string;
}

interface AIInsight {
  name: string;
  email: string;
  matching_score: number;
  recommended: boolean;
  reasoning: string;
}

interface FormData {
  title: string;
  company: string;
  location: string;
  type: string;
  salaryMin: string;
  salaryMax: string;
  description: string;
  tags: string;
}

interface ConnectResponse {
  publicKey: PublicKey;
}

interface PhantomProvider {
  isPhantom: boolean;
  connect: () => Promise<ConnectResponse>;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
}

declare global {
  interface Window {
    solana?: PhantomProvider;
  }
}

const RecruiterPage = () => {
  const [activeTab, setActiveTab] = useState<"create" | "manage">("create");
  const [postedJobs, setPostedJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [recruiterId, setRecruiterId] = useState<string | null>(null);

  // Wallet and credit states
  const [credits, setCredits] = useState(0);
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [solanaPublicKey, setSolanaPublicKey] = useState<string | null>(null);
  const [showWalletPopup, setShowWalletPopup] = useState(false);

  // AI Insights states
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [showInsights, setShowInsights] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    title: "",
    company: "",
    location: "",
    type: "full-time",
    salaryMin: "",
    salaryMax: "",
    description: "",
    tags: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Get recruiter ID from cookies
  useEffect(() => {
    const userId = Cookies.get("UserId");
    if (userId) {
      setRecruiterId(userId);
      fetchCredits(userId);
      if (activeTab === "manage") {
        fetchPostedJobs(userId);
      }
    }
  }, [activeTab]);

  // Fetch credits for the recruiter
  const fetchCredits = useCallback(async (userId: string) => {
    try {
      const response = await fetch(
        `https://web3-job-platform.onrender.com/credit/${userId}`
      );
      if (!response.ok) throw new Error("Failed to fetch credits");
      const data = await response.json();
      setCredits(data.credits);
    } catch (error) {
      console.error("Error fetching credits:", error);
    }
  }, []);

  // Fetch jobs from API
  const fetchPostedJobs = useCallback(async (userId: string) => {
    try {
      const response = await fetch(
        `https://web3-job-platform.onrender.com/jobs/recruiter/${userId}`
      );
      if (!response.ok) throw new Error("Failed to fetch jobs");
      const data: Job[] = await response.json();

      const transformedJobs = data.map((job) => ({
        ...job,
        salary: `$${Math.floor(job.salary_min / 1000)}k - $${Math.floor(
          job.salary_max / 1000
        )}k`,
        posted: "today",
        applicants: "0",
        status: "active",
        views: Math.floor(Math.random() * 50),
        companyColor: getCompanyColor(job.company),
        logo: job.company.charAt(0).toUpperCase(),
      }));

      setPostedJobs(transformedJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  }, []);

  // Connect to Solana wallet (Phantom)
  const connectWallet = useCallback(async () => {
    try {
      // Check if Phantom wallet is installed
      if (
        typeof window === "undefined" ||
        !window.solana ||
        !window.solana.isPhantom
      ) {
        setShowWalletPopup(true);
        return;
      }

      const resp = await window.solana.connect();
      setSolanaPublicKey(resp.publicKey.toString());
      setWalletConnected(true);
      return resp.publicKey;
    } catch (err) {
      console.error("Wallet connection error:", err);
      setShowWalletPopup(true);
    }
  }, []);

  // Purchase credits with Solana
  const purchaseCredits = useCallback(async () => {
    if (!walletConnected || !solanaPublicKey) {
      await connectWallet();
      return;
    }

    setPaymentProcessing(true);

    try {
      // Connect to Solana devnet
      const connection = new Connection("https://api.devnet.solana.com");
      const merchantPublicKey = new PublicKey(
        "5RAdGvEGs6SvNYif1yYqRSDUZhAbH6eMiwCzVhfmxYQ"
      );

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(solanaPublicKey),
          toPubkey: merchantPublicKey,
          lamports: 0.1 * LAMPORTS_PER_SOL,
        })
      );

      // Set recent blockhash
      transaction.feePayer = new PublicKey(solanaPublicKey);
      const { blockhash } = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;

      // Sign and send transaction
      if (!window.solana) throw new Error("Phantom wallet not available");
      const signed = await window.solana.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());

      // Confirm transaction
      await connection.confirmTransaction(signature);

      // Update credits
      setCredits((prev) => prev + 10);
      setShowCreditPopup(false);
      alert("Payment successful! 10 credits added to your account");
    } catch (error) {
      console.error("Payment error:", error);
      alert(
        `Payment failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setPaymentProcessing(false);
    }
  }, [connectWallet, solanaPublicKey, walletConnected]);

  // Fetch AI insights for a job
  const fetchAIInsights = useCallback(
    async (jobId: string) => {
      // Check credits
      if (credits <= 0) {
        setShowCreditPopup(true);
        return;
      }

      setCurrentJobId(jobId);
      setLoadingInsights(true);
      setShowInsights(true);

      try {
        const response = await fetch(
          `https://web3-job-platform.onrender.com/jobs/${jobId}/suggestions`
        );
        if (!response.ok) throw new Error("Failed to fetch insights");
        const data = await response.json();
        setAiInsights(data.matches);

        // Deduct credit
        setCredits((prev) => prev - 1);
      } catch (error) {
        console.error("Error fetching AI insights:", error);
        setAiInsights([]);
      } finally {
        setLoadingInsights(false);
      }
    },
    [credits]
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = useCallback(async () => {
    // Validation
    if (
      !formData.title ||
      !formData.company ||
      !formData.location ||
      !formData.salaryMin ||
      !formData.salaryMax ||
      !formData.description
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (!recruiterId) {
      alert("Recruiter ID not found");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://web3-job-platform.onrender.com/jobs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            company: formData.company,
            location: formData.location,
            salary_min: parseInt(formData.salaryMin),
            salary_max: parseInt(formData.salaryMax),
            type: formData.type,
            description: formData.description,
            tags: formData.tags,
            recruiter_id: recruiterId,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to create job");

      const newJob: Job = await response.json();

      setPostedJobs((prev) => [
        {
          ...newJob,
          salary: `$${Math.floor(newJob.salary_min / 1000)}k - $${Math.floor(
            newJob.salary_max / 1000
          )}k`,
          posted: "today",
          applicants: "0",
          status: "active",
          views: Math.floor(Math.random() * 50),
          companyColor: getCompanyColor(newJob.company),
          logo: newJob.company.charAt(0).toUpperCase(),
        },
        ...prev,
      ]);

      // Reset form
      setFormData({
        title: "",
        company: "",
        location: "",
        type: "full-time",
        salaryMin: "",
        salaryMax: "",
        description: "",
        tags: "",
      });

      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error("Error creating job post:", error);
      alert(
        `Error creating job: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, recruiterId]);

  const getCompanyColor = useCallback((company: string) => {
    const colors = [
      "from-blue-500 to-cyan-500",
      "from-purple-500 to-pink-500",
      "from-green-500 to-emerald-500",
      "from-orange-500 to-red-500",
      "from-indigo-500 to-blue-500",
      "from-pink-500 to-rose-500",
      "from-yellow-500 to-amber-500",
      "from-teal-500 to-emerald-500",
    ];

    const hash = company
      .split("")
      .reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return colors[hash % colors.length];
  }, []);

  const deleteJob = useCallback(async (jobId: string) => {
    try {
      const response = await fetch(
        `https://web3-job-platform.onrender.com/jobs/${jobId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete job");

      setPostedJobs((prev) => prev.filter((job) => job.id !== jobId));
    } catch (error) {
      console.error("Error deleting job:", error);
      alert(
        `Error deleting job: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }, []);

  const toggleJobStatus = useCallback((jobId: string) => {
    setPostedJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              status: job.status === "active" ? "paused" : "active",
            }
          : job
      )
    );
  }, []);

  const filteredJobs = postedJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || job.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-900">
      {/* Wallet Connection Indicator */}
      {walletConnected ? (
        <div className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-full text-green-300 text-sm backdrop-blur-sm mt-24 ml-70 ">
          <span>Wallet Connected</span>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="absolute top-4 left-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full text-sm backdrop-blur-sm hover:from-purple-600 hover:to-indigo-600 mt-24 ml-70"
        >
          Connect Wallet
        </button>
      )}

      {/* Credit Indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-full text-white text-sm backdrop-blur-sm mt-24 mr-70">
        <Brain className="w-4 h-4 text-purple-400" />
        <span>AI Credits: {credits}</span>
      </div>

      {/* Wallet Installation Popup */}
      {showWalletPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800/90 backdrop-blur-lg rounded-2xl border border-slate-700/50 w-full max-w-md p-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 397.7 311.7"
                  className="w-8 h-8"
                >
                  <path
                    d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7.1 4.6 11.2l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7.1-4.6-11.2l62.7-62.7z"
                    fill="#9945FF"
                  />
                  <path
                    d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7.1 4.6 11.2l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7.1-4.6-11.2L64.6 3.8z"
                    fill="#14F195"
                  />
                  <path
                    d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7.1-4.6 11.2l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7.1 4.6-11.2l-62.7-62.7z"
                    fill="#00D18C"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Phantom Wallet Required
              </h3>
              <p className="text-slate-300 mb-6">
                To connect your wallet, please install the Phantom extension for
                your browser.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowWalletPopup(false)}
                  className="px-6 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-colors"
                >
                  Cancel
                </button>
                <a
                  href="https://phantom.app/download"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors font-medium"
                >
                  Install Phantom
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30 rounded-full text-blue-300 text-sm backdrop-blur-sm">
              <Building className="w-4 h-4" />
              <span>Recruiter Dashboard</span>
            </div>

            {/* AI Insights Button */}
            <button
              onClick={() => {
                if (credits > 0) {
                  // Handle global AI insights if needed
                } else {
                  setShowCreditPopup(true);
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-400/30 rounded-full text-purple-300 text-sm backdrop-blur-sm hover:from-purple-600/30 hover:to-purple-700/30 transition-all duration-300"
            >
              <Brain className="w-4 h-4" />
              <span>Get AI Insights</span>
            </button>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Post Your{" "}
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Job Opening
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            Connect with talented professionals and build your dream team
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex gap-2 bg-slate-800/30 backdrop-blur-sm rounded-2xl p-2 border border-slate-700/50 shadow-xl">
            <button
              onClick={() => setActiveTab("create")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                activeTab === "create"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
              }`}
            >
              <Plus className="w-5 h-5" />
              Create Job Post
            </button>
            <button
              onClick={() => setActiveTab("manage")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                activeTab === "manage"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
              }`}
            >
              <Eye className="w-5 h-5" />
              Manage Posts ({postedJobs.length})
            </button>
          </div>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-400/30 rounded-xl text-green-300 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Job posted successfully!</span>
            </div>
          </div>
        )}

        {/* Create Job Form */}
        {activeTab === "create" && (
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-xl">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-300 font-medium mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. TechCorp Inc."
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. New York, NY"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-2">
                    Job Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm cursor-pointer"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="remote">Remote</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-2">
                    Salary Range (Min) *
                  </label>
                  <input
                    type="number"
                    name="salaryMin"
                    value={formData.salaryMin}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. 80000"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-2">
                    Salary Range (Max) *
                  </label>
                  <input
                    type="number"
                    name="salaryMax"
                    value={formData.salaryMax}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. 120000"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-2">
                  Job Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-2">
                  Skills/Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="e.g. React, Node.js, Python, AWS (comma separated)"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  className="flex-1 px-6 py-3 bg-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-600/50 hover:text-white transition-all duration-300 font-medium backdrop-blur-sm"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg flex items-center justify-center gap-2 ${
                    isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                  {isSubmitting ? "Posting..." : "Post Job"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Manage Jobs */}
        {activeTab === "manage" && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search your job posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-6 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-6 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 backdrop-blur-sm cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
            </div>

            {/* Job Posts List */}
            {filteredJobs.length === 0 ? (
              <div className="text-center py-16 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-800/50 rounded-full mb-6 backdrop-blur-sm">
                  <Building className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  No job posts found
                </h3>
                <p className="text-slate-300 mb-6">
                  {postedJobs.length === 0
                    ? "Create your first job post to get started"
                    : "Try adjusting your search criteria"}
                </p>
                <button
                  onClick={() => setActiveTab("create")}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg"
                >
                  Create Job Post
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-slate-800/40 border border-slate-600/50 rounded-2xl p-6 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 backdrop-blur-sm"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${job.companyColor} rounded-xl flex items-center justify-center text-xl text-white shadow-lg`}
                      >
                        {job.logo}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">
                              {job.title}
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
                              <Building className="w-4 h-4 text-slate-400" />
                              <span className="text-blue-400 font-medium">
                                {job.company}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                job.status === "active"
                                  ? "bg-green-500/20 text-green-300 border border-green-400/30"
                                  : "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30"
                              }`}
                            >
                              {job.status === "active" ? "Active" : "Paused"}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          <div className="flex items-center gap-2 text-slate-300">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span className="text-sm">{job.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-300">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span className="text-sm">{job.type}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-300">
                            <DollarSign className="w-4 h-4 text-green-400" />
                            <span className="text-sm font-medium text-green-400">
                              {job.salary}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-300">
                            <Users className="w-4 h-4 text-slate-400" />
                            <span className="text-sm">
                              {job.applicants} applied
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-600/50">
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span>Posted {job.posted}</span>
                            <span>•</span>
                            <span>{job.views} views</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleJobStatus(job.id)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                job.status === "active"
                                  ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30 hover:bg-yellow-500/30"
                                  : "bg-green-500/20 text-green-300 border border-green-400/30 hover:bg-green-500/30"
                              }`}
                            >
                              {job.status === "active" ? "Pause" : "Activate"}
                            </button>

                            {/* AI Insights Button */}
                            <button
                              onClick={() => fetchAIInsights(job.id)}
                              className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 border border-purple-400/30 rounded-lg hover:bg-purple-500/30 transition-colors text-sm font-medium flex items-center gap-2"
                            >
                              <Brain className="w-4 h-4" />
                              AI Insights
                            </button>

                            <button className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-600/50 hover:text-white transition-colors text-sm font-medium">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteJob(job.id)}
                              className="px-4 py-2 bg-red-500/20 text-red-300 border border-red-400/30 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* AI Insights Modal */}
      {showInsights && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800/90 backdrop-blur-lg rounded-2xl border border-slate-700/50 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-800/90 backdrop-blur-lg p-6 border-b border-slate-700/50 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Brain className="w-6 h-6 text-purple-400" />
                  AI Candidate Insights
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  For Job ID: {currentJobId}
                </p>
              </div>
              <button
                onClick={() => setShowInsights(false)}
                className="p-2 rounded-full hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {loadingInsights ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-700/50 rounded-full mb-6">
                    <Brain className="w-8 h-8 text-purple-400 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">
                    Analyzing candidates...
                  </h3>
                  <p className="text-slate-400">
                    Our AI is scanning profiles to find your perfect match
                  </p>
                </div>
              ) : aiInsights.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-700/50 rounded-full mb-6">
                    <Brain className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">
                    No insights found
                  </h3>
                  <p className="text-slate-400 mb-6">
                    We couldnt find matching candidates for this position
                  </p>
                  <button
                    onClick={() =>
                      currentJobId && fetchAIInsights(currentJobId)
                    }
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-medium"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-700/40 rounded-xl p-4 border border-slate-600/50">
                      <p className="text-slate-400 text-sm">Total Matches</p>
                      <p className="text-2xl font-bold text-white">
                        {aiInsights.length}
                      </p>
                    </div>
                    <div className="bg-slate-700/40 rounded-xl p-4 border border-slate-600/50">
                      <p className="text-slate-400 text-sm">Top Match Score</p>
                      <p className="text-2xl font-bold text-green-400">
                        {Math.max(...aiInsights.map((i) => i.matching_score))}%
                      </p>
                    </div>
                    <div className="bg-slate-700/40 rounded-xl p-4 border border-slate-600/50">
                      <p className="text-slate-400 text-sm">Recommended</p>
                      <p className="text-2xl font-bold text-white">
                        {aiInsights.filter((i) => i.recommended).length}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {aiInsights.map((candidate, index) => (
                      <div
                        key={index}
                        className={`bg-slate-700/40 rounded-xl p-5 border ${
                          candidate.recommended
                            ? "border-green-500/30"
                            : "border-slate-600/50"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-white">
                              {candidate.name}
                              {candidate.recommended && (
                                <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-300 text-xs font-medium rounded-full">
                                  Recommended
                                </span>
                              )}
                            </h3>
                            <p className="text-blue-400">{candidate.email}</p>
                          </div>
                          <div className="flex items-center gap-2 bg-slate-800/70 px-3 py-1 rounded-full">
                            <TrendingUp className="w-4 h-4 text-yellow-400" />
                            <span className="font-bold text-white">
                              {candidate.matching_score}%
                            </span>
                            <span className="text-slate-400 text-sm">
                              Match
                            </span>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h4 className="text-slate-300 font-medium mb-2 flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-400" />
                            AI Reasoning
                          </h4>
                          <p className="text-slate-400 text-sm bg-slate-800/30 p-4 rounded-xl">
                            {candidate.reasoning}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Credit Popup */}
      {showCreditPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800/90 backdrop-blur-lg rounded-2xl border border-slate-700/50 w-full max-w-md p-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
                <X className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                No Credits Left
              </h3>
              <p className="text-slate-300 mb-6">
                Youve used all your AI insights credits. Please purchase more to
                continue.
              </p>

              <div className="bg-slate-700/40 rounded-xl p-4 mb-6 border border-slate-600/50">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-slate-300">10 Credits</span>
                  <span className="text-green-400 font-bold">0.1 SOL</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span>≈ $1.50 USD</span>
                  <span className="mx-1">•</span>
                  <span>Instant delivery</span>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowCreditPopup(false)}
                  className="px-6 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={purchaseCredits}
                  disabled={paymentProcessing}
                  className={`px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors flex items-center justify-center ${
                    paymentProcessing ? "opacity-75" : ""
                  }`}
                >
                  {paymentProcessing ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 397.7 311.7"
                      className="w-5 h-5 mr-2"
                    >
                      <path
                        d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7.1 4.6 11.2l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7.1-4.6-11.2l62.7-62.7z"
                        fill="#9945FF"
                      />
                      <path
                        d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7.1 4.6 11.2l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7.1-4.6-11.2L64.6 3.8z"
                        fill="#14F195"
                      />
                      <path
                        d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7.1-4.6 11.2l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7.1 4.6-11.2l-62.7-62.7z"
                        fill="#00D18C"
                      />
                    </svg>
                  )}
                  {paymentProcessing ? "Processing..." : "Pay with Solana"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterPage;
