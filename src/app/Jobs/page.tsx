"use client";
import {
  Bookmark,
  BookmarkCheck,
  Building,
  Clock,
  DollarSign,
  Filter,
  MapPin,
  Search,
  Star,
  TrendingUp,
  Users,
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

interface ConnectResponse {
  publicKey: PublicKey;
}

interface PhantomProvider {
  isPhantom: boolean;
  connect: () => Promise<ConnectResponse>;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
}

// Define types for better type safety
type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  salary_min: number;
  salary_max: number;
  applicants: string;
  posted: string;
  created_at: string;
  rating: string;
  growth: string;
  logo: string;
  companyColor: string;
  description: string;
  requirements: string[];
  featured: boolean;
};

interface ApiJob {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary_min: number;
  salary_max: number;
  created_at: string;
  description: string;
  tags: string;
}

type AIInsight = {
  title: string;
  company: string;
  matching_score: number;
  recommended: boolean;
  reasoning: string;
};

const JobOpportunitiesPage = () => {
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("relevant");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [credits, setCredits] = useState(0);
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [solanaPublicKey, setSolanaPublicKey] = useState<string | null>(null);
  const [showWalletPopup, setShowWalletPopup] = useState(false);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [showInsights, setShowInsights] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Get API base URL from environment variables
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://web3-job-platform.onrender.com";

  // Merchant public key should be stored in environment variables
  const MERCHANT_PUBLIC_KEY =
    process.env.NEXT_PUBLIC_MERCHANT_PUBLIC_KEY ||
    "5RAdGvEGs6SvNYif1yYqRSDUZhAbH6eMiwCzVhfmxYQ";

  // Helper to generate company color based on company name
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

  // Format API date to relative time
  const formatDate = useCallback((dateString: string) => {
    const now = new Date();
    const created = new Date(dateString);
    const diffDays = Math.floor(
      (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return "today";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  }, []);

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/jobs`);
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await response.json();

        // Transform API data to match our structure
        const transformedJobs: Job[] = data.map((job: ApiJob) => ({
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          type: job.type,
          salary: `$${Math.floor(job.salary_min / 1000)}k - $${Math.floor(
            job.salary_max / 1000
          )}k`,
          salary_min: job.salary_min,
          salary_max: job.salary_max,
          applicants: Math.floor(Math.random() * 30 + 10).toString(),
          posted: formatDate(job.created_at),
          created_at: job.created_at,
          rating: (4.0 + Math.random() * 0.9).toFixed(1),
          growth: `${Math.floor(Math.random() * 20 + 5)}%`,
          logo: job.company.charAt(0),
          companyColor: getCompanyColor(job.company),
          description: job.description,
          requirements: job.tags.split(",").map((tag: string) => tag.trim()),
          featured: Math.random() > 0.7,
        }));

        setJobs(transformedJobs);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();

    // Get user ID from cookies
    const userId = Cookies.get("UserId");
    if (userId) {
      setUserId(userId);
      fetchCredits(userId);
    }
  }, [API_BASE_URL, formatDate, getCompanyColor]);

  // Fetch credits for the user
  const fetchCredits = useCallback(
    async (userId: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/credit/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch credits");
        const data = await response.json();
        setCredits(data.credits);
      } catch (error) {
        console.error("Error fetching credits:", error);
      }
    },
    [API_BASE_URL]
  );

  const toggleSaveJob = useCallback((jobId: string) => {
    setSavedJobs((prev) => {
      const newSaved = new Set(prev);
      if (newSaved.has(jobId)) {
        newSaved.delete(jobId);
      } else {
        newSaved.add(jobId);
      }
      return newSaved;
    });
  }, []);

  // Fetch AI insights for user
  const fetchAIInsights = useCallback(async () => {
    if (!userId) return;

    // Check credits before proceeding
    if (credits <= 0) {
      setShowCreditPopup(true);
      return;
    }

    setLoadingInsights(true);
    setShowInsights(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/users/${userId}/suggestions`
      );
      if (!response.ok) throw new Error("Failed to fetch insights");
      const data = await response.json();
      setAiInsights(data);

      // Update credits after successful fetch
      setCredits((prev) => prev - 1);
    } catch (error) {
      console.error("Error fetching AI insights:", error);
      setAiInsights([]);
    } finally {
      setLoadingInsights(false);
    }
  }, [API_BASE_URL, credits, userId]);

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
      const merchantPublicKey = new PublicKey(MERCHANT_PUBLIC_KEY);

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(solanaPublicKey),
          toPubkey: merchantPublicKey,
          lamports: 0.1 * LAMPORTS_PER_SOL, // 0.1 SOL for 10 credits
        })
      );

      // Set recent blockhash
      transaction.feePayer = new PublicKey(solanaPublicKey);
      const { blockhash } = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;

      // Sign and send transaction - now with proper typing
      if (!window.solana) {
        throw new Error("Phantom wallet not detected");
      }

      const signed = await window.solana.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());

      // Confirm transaction
      await connection.confirmTransaction(signature);

      // Update credits after successful payment
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
  }, [MERCHANT_PUBLIC_KEY, connectWallet, solanaPublicKey, walletConnected]);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.requirements.some((req) =>
        req.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesFilter =
      selectedFilter === "all" ||
      job.type.toLowerCase().includes(selectedFilter);
    return matchesSearch && matchesFilter;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "salary":
        return b.salary_max - a.salary_max;
      case "relevant":
      default:
        return b.featured === a.featured ? 0 : b.featured ? -1 : 1;
    }
  });

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-slate-300">Loading job opportunities...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-900 flex items-center justify-center">
        <div className="text-center p-6 bg-slate-800/50 rounded-xl border border-red-500/30 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-white mb-2">
            Error Loading Jobs
          </h3>
          <p className="text-slate-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-900">
      {/* Wallet Connection Indicator */}
      {walletConnected ? (
        <div className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-full text-green-300 text-sm backdrop-blur-sm mt-24 ml-70">
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

      {/* AI Insights Modal */}
      {showInsights && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800/90 backdrop-blur-lg rounded-2xl border border-slate-700/50 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-800/90 backdrop-blur-lg p-6 border-b border-slate-700/50 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Brain className="w-6 h-6 text-purple-400" />
                  AI Job Recommendations
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Personalized suggestions based on your profile
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
                    Analyzing your profile...
                  </h3>
                  <p className="text-slate-400">
                    Our AI is finding the perfect job matches for you
                  </p>
                </div>
              ) : aiInsights.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-700/50 rounded-full mb-6">
                    <Brain className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">
                    No recommendations found
                  </h3>
                  <p className="text-slate-400 mb-6">
                    We couldnt find personalized job suggestions
                  </p>
                  <button
                    onClick={fetchAIInsights}
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
                    {aiInsights.map((job, index) => (
                      <div
                        key={index}
                        className={`bg-slate-700/40 rounded-xl p-5 border ${
                          job.recommended
                            ? "border-green-500/30"
                            : "border-slate-600/50"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-white">
                              {job.title}
                              {job.recommended && (
                                <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-300 text-xs font-medium rounded-full">
                                  Recommended
                                </span>
                              )}
                            </h3>
                            <p className="text-blue-400">{job.company}</p>
                          </div>
                          <div className="flex items-center gap-2 bg-slate-800/70 px-3 py-1 rounded-full">
                            <TrendingUp className="w-4 h-4 text-yellow-400" />
                            <span className="font-bold text-white">
                              {job.matching_score}%
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
                            {job.reasoning}
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

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30 rounded-full text-blue-300 text-sm backdrop-blur-sm">
              <Star className="w-4 h-4" />
              <span>New opportunities just for you</span>
            </div>

            {/* AI Insights Button */}
            <button
              onClick={fetchAIInsights}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-400/30 rounded-full text-purple-300 text-sm backdrop-blur-sm hover:from-purple-600/30 hover:to-purple-700/30 transition-all duration-300"
            >
              <Brain className="w-4 h-4" />
              <span>Get AI Insights</span>
            </button>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Find Your{" "}
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Dream Job
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            Discover handpicked opportunities that match your skills and
            ambitions
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-12 bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="text"
                placeholder="Search jobs, companies, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 shadow-lg backdrop-blur-sm"
              />
            </div>

            <div className="flex gap-4">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="hidden md:block px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-lg cursor-pointer backdrop-blur-sm"
              >
                <option value="all">All Types</option>
                <option value="full-time">Full-time</option>
                <option value="remote">Remote</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>

              <button
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                className="px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-300 shadow-lg group backdrop-blur-sm"
              >
                <Filter className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
              </button>
            </div>
          </div>

          {/* Mobile filter menu */}
          {isFilterMenuOpen && (
            <div className="md:hidden bg-slate-800/50 rounded-xl p-4 mb-6 backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-lg cursor-pointer"
                >
                  <option value="all">All Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="remote">Remote</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-lg cursor-pointer"
                >
                  <option value="relevant">Most Relevant</option>
                  <option value="newest">Newest</option>
                  <option value="salary">Salary</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-slate-300">
            <span>
              Showing{" "}
              <span className="text-blue-400 font-semibold">
                {sortedJobs.length}
              </span>{" "}
              job opportunities
            </span>
            <div className="flex items-center gap-4">
              <span className="hidden md:inline text-slate-400">Sort by:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy("relevant")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === "relevant"
                      ? "bg-blue-500/20 text-blue-300 border border-blue-400/30"
                      : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-300"
                  }`}
                >
                  Most Relevant
                </button>
                <button
                  onClick={() => setSortBy("newest")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === "newest"
                      ? "bg-blue-500/20 text-blue-300 border border-blue-400/30"
                      : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-300"
                  }`}
                >
                  Newest
                </button>
                <button
                  onClick={() => setSortBy("salary")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === "salary"
                      ? "bg-blue-500/20 text-blue-300 border border-blue-400/30"
                      : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-300"
                  }`}
                >
                  Salary
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedJobs.map((job) => (
            <div
              key={job.id}
              className={`relative bg-slate-800/40 border rounded-2xl p-6 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 backdrop-blur-sm ${
                job.featured
                  ? "border-blue-400/30 shadow-lg shadow-blue-500/10 ring-1 ring-blue-400/20"
                  : "border-slate-600/50 hover:border-slate-500/50"
              }`}
            >
              {job.featured && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-semibold rounded-full shadow-lg">
                  ⭐ Featured
                </div>
              )}

              <div className="flex flex-col">
                <div className="flex items-start gap-4 mb-5">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${job.companyColor} rounded-xl flex items-center justify-center text-xl text-white shadow-lg`}
                  >
                    {job.logo}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-white line-clamp-1">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Building className="w-4 h-4 text-slate-400" />
                          <span className="text-blue-400 font-medium">
                            {job.company}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className="text-slate-400 hover:text-red-400 transition-colors duration-300"
                      >
                        {savedJobs.has(job.id) ? (
                          <BookmarkCheck className="w-5 h-5 text-red-400" />
                        ) : (
                          <Bookmark className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-1 text-slate-300 text-sm">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{job.rating}</span>
                      <span className="mx-2">•</span>
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span>{job.growth} growth</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
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
                    <span className="text-sm">{job.applicants} applied</span>
                  </div>
                </div>

                <p className="text-slate-300 mb-5 text-sm line-clamp-2">
                  {job.description}
                </p>

                <div className="mb-5">
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.slice(0, 3).map((req, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-blue-500/20 border border-blue-400/30 text-blue-300 rounded-lg text-xs font-medium backdrop-blur-sm"
                      >
                        {req}
                      </span>
                    ))}
                    {job.requirements.length > 3 && (
                      <span className="px-3 py-1.5 bg-slate-700/50 border border-slate-600/50 text-slate-300 rounded-lg text-xs backdrop-blur-sm">
                        +{job.requirements.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-auto pt-4 border-t border-slate-600/50">
                  <span className="text-slate-400 text-sm">
                    Posted {job.posted}
                  </span>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-600/50 hover:text-white transition-colors text-sm font-medium backdrop-blur-sm">
                      Details
                    </button>
                    <button className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium text-sm shadow-lg">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedJobs.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-800/50 rounded-full mb-6 backdrop-blur-sm">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              No jobs found
            </h3>
            <p className="text-slate-300 mb-6 max-w-md mx-auto">
              Try adjusting your search criteria or explore different keywords
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedFilter("all");
                  setSortBy("relevant");
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg"
              >
                Reset Filters
              </button>
              <button className="px-6 py-3 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-600/50 hover:text-white transition-colors font-medium backdrop-blur-sm">
                Browse All Jobs
              </button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {sortedJobs.length > 0 && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm rounded-xl p-2 border border-slate-700/50">
              <button className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-600/50 hover:text-white transition-colors">
                Previous
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg">
                1
              </button>
              <button className="px-4 py-2 text-slate-300 rounded-lg hover:bg-slate-700/50 hover:text-white transition-colors">
                2
              </button>
              <button className="px-4 py-2 text-slate-300 rounded-lg hover:bg-slate-700/50 hover:text-white transition-colors">
                3
              </button>
              <span className="px-2 text-slate-400">...</span>
              <button className="px-4 py-2 text-slate-300 rounded-lg hover:bg-slate-700/50 hover:text-white transition-colors">
                8
              </button>
              <button className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-600/50 hover:text-white transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobOpportunitiesPage;
