import React, { useState } from "react";
import ProfileCard from "../ui/ProfileCard";
import SignupPopup from "../auth/SignupPopup";
import { Button } from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";
import toast, { Toaster } from "react-hot-toast";

export default function Hero() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { isLoggedIn, userData, handleLogin, handleLogout } = useAuth();

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #374151",
          },
          success: {
            style: {
              background: "#065f46",
              border: "1px solid #10b981",
            },
          },
          error: {
            style: {
              background: "#7f1d1d",
              border: "1px solid #ef4444",
            },
          },
        }}
      />

      <section
        id="home"
        className="pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-3 sm:px-4 md:px-8"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-8 sm:mb-12 lg:mb-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                <span className="block">Find Your</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                  Dream Career
                </span>
                <span className="block">Through Connections</span>
              </h1>
              <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-lg">
                Join the world&apos;s most powerful job networking platform
                where opportunities meet talent. Connect, collaborate, and
                accelerate your career.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Button
                  onClick={openPopup}
                  variant="primary"
                  size="lg"
                  className="px-6 sm:px-8"
                >
                  Join Free Today
                </Button>
                <Button variant="outline" size="lg" className="px-6 sm:px-8">
                  <div className="flex items-center justify-center">
                    <span>Watch Demo</span>
                    <svg
                      className="ml-2 w-4 h-4 sm:w-5 sm:h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                </Button>
              </div>
            </div>

            <div className="lg:w-1/2 relative">
              <div className="relative">
                <div className="absolute -top-6 -right-6 sm:-top-10 sm:-right-10 w-48 h-48 sm:w-72 sm:h-72 bg-purple-600 rounded-full mix-blend-screen opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-6 -left-6 sm:-bottom-10 sm:-left-10 w-48 h-48 sm:w-72 sm:h-72 bg-blue-600 rounded-full mix-blend-screen opacity-20 animate-pulse"></div>

                <div className="relative bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-105">
                  <div className="p-3 sm:p-4 bg-gray-900 flex space-x-2">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                  </div>

                  <ProfileCard
                    isLoggedIn={isLoggedIn}
                    toggleLogin={handleLogout} // This should work if handleLogout has the right signature
                    openSignupPopup={openPopup}
                    userData={userData}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <SignupPopup
          isOpen={isPopupOpen}
          onClose={closePopup}
          onLogin={handleLogin}
        />
      </section>
    </>
  );
}
