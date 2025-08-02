import { useState, useEffect } from "react";

interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  image: string;
  current_company: string;
  role: string;
}

interface UserData {
  name?: string;
  title?: string;
  status?: string;
  image?: string;
  role?: string;
}

interface NavbarProps {
  isScrolled: boolean;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  isLoggedIn: boolean;
  toggleLogin: () => void;
}

export default function Navbar({
  isScrolled,
  isMobileMenuOpen,
  toggleMobileMenu,
}: NavbarProps) {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData>({});
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      // Get cookies
      const cookies = document.cookie.split(";").reduce((acc, cookie) => {
        const [name, value] = cookie.trim().split("=");
        acc[name] = value;
        return acc;
      }, {} as Record<string, string>);

      const token = cookies["token"];
      const userCookie = cookies["user"];

      console.log("Token:", token);
      console.log("User Cookie:", userCookie);

      if (token) {
        try {
          let userId = null;

          // Try to get user ID from user cookie first
          if (userCookie) {
            try {
              const parsedUser = JSON.parse(decodeURIComponent(userCookie));
              userId = parsedUser.id;
              console.log("User ID from cookie:", userId);
            } catch (e) {
              console.error("Error parsing user cookie:", e);
            }
          }

          // If no user ID from cookie, try userId cookie
          if (!userId) {
            userId = cookies["userId"];
            console.log("User ID from userId cookie:", userId);
          }

          if (userId) {
            // Fetch user data from API
            const response = await fetch(
              `https://web3-job-platform.onrender.com/user/${userId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (response.ok) {
              const data: { user: User } = await response.json();
              console.log("API Response:", data);

              setUserData({
                name: data.user.full_name,
                title: data.user.current_company,
                image: data.user.image,
                role: data.user.role,
                status: "Active now",
              });
              setIsLoggedIn(true);
            } else {
              console.error("API request failed:", response.status);
              // Clear cookies on invalid token
              document.cookie =
                "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              document.cookie =
                "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              setIsLoggedIn(false);
            }
          } else {
            console.log("No user ID found, but token exists");
            // If we have a token but no user ID, try to use cookie data
            if (userCookie) {
              try {
                const parsedUser = JSON.parse(decodeURIComponent(userCookie));
                setUserData({
                  name: parsedUser.name || parsedUser.full_name,
                  title: parsedUser.title || parsedUser.current_company,
                  image: parsedUser.image,
                  role: parsedUser.role,
                  status: "Active now",
                });
                setIsLoggedIn(true);
              } catch (e) {
                console.error("Error parsing user cookie for fallback:", e);
                setIsLoggedIn(false);
              }
            } else {
              setIsLoggedIn(false);
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setIsLoggedIn(false);
        }
      } else {
        console.log("No token found");
        setIsLoggedIn(false);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const toggleLogin = () => {
    if (isLoggedIn) {
      // Logout - clear all cookies
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Clear localStorage if any
      localStorage.clear();
      sessionStorage.clear();

      // Reset state
      setUserData({});
      setIsLoggedIn(false);

      // Force page reload to ensure clean state
      setTimeout(() => {
        window.location.reload();
      }, 100); // Small delay to ensure state updates
    } else {
      // Login
      window.location.href = "/login";
    }
  };

  // Alternative logout function with immediate redirect to home
  const handleLogoutWithRedirect = () => {
    // Clear all cookies
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Clear storage
    localStorage.clear();
    sessionStorage.clear();

    // Redirect to home page (this will cause a full page reload)
    window.location.href = "/";
  };

  if (isLoading) {
    return (
      <nav className="fixed w-full z-50 bg-black/90 backdrop-blur-md py-2">
        <div className="container mx-auto px-3 sm:px-4 md:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-purple-600 to-blue-500 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center">
              <span className="text-sm sm:text-xl font-bold">C</span>
            </div>
            <span className="text-sm sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              CareerConnect
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="animate-pulse bg-gray-700 rounded-full w-8 h-8" />
            <div className="animate-pulse bg-gray-700 rounded-lg w-24 h-8" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/90 backdrop-blur-md py-2" : "bg-transparent py-3"
      }`}
    >
      <div className="container mx-auto px-3 sm:px-4 md:px-8 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center">
            <span className="text-sm sm:text-xl font-bold">C</span>
          </div>
          <span className="text-sm sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            CareerConnect
          </span>
        </div>

        <div className="hidden md:flex space-x-6">
          {["Home", "Features", "How It Works", "Testimonials", "Pricing"].map(
            (item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-sm hover:text-blue-400 transition-colors"
              >
                {item}
              </a>
            )
          )}
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Desktop User Profile or Sign In */}
          {isLoggedIn ? (
            <div className="hidden md:flex items-center space-x-2">
              <div className="relative">
                {userData.image ? (
                  <img
                    src={userData.image}
                    alt={userData.name || "Profile"}
                    className="w-8 h-8 rounded-full object-cover border-2 border-blue-500"
                  />
                ) : (
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-8 h-8 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {userData.name?.charAt(0) || "U"}
                    </span>
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-gray-900"></div>
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">
                  {userData.name || "User"}
                </span>
                {userData.title && (
                  <span className="text-xs text-gray-400 -mt-0.5">
                    {userData.title}
                  </span>
                )}
              </div>

              <button
                onClick={handleLogoutWithRedirect} // Using the redirect version
                className="px-2 py-1 text-xs rounded-lg hover:bg-gray-800 transition-colors ml-2"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={toggleLogin}
              className="hidden md:block px-3 py-1.5 text-sm rounded-lg hover:bg-gray-800 transition-colors"
            >
              Sign In
            </button>
          )}

          {/* Get Started / Dashboard Button */}
          <button
            onClick={() =>
              (window.location.href = isLoggedIn ? "/dashboard" : "/signup")
            }
            className="hidden md:block px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
          >
            {isLoggedIn ? "Dashboard" : "Get Started"}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="space-y-1.5">
              <div
                className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                  isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              ></div>
              <div
                className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                  isMobileMenuOpen ? "opacity-0" : ""
                }`}
              ></div>
              <div
                className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                  isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              ></div>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-gray-900/95 backdrop-blur-md border-t border-gray-700 px-4 py-6 space-y-4">
          {["Home", "Features", "How It Works", "Testimonials", "Pricing"].map(
            (item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="block text-sm hover:text-blue-400 transition-colors py-2"
                onClick={toggleMobileMenu}
              >
                {item}
              </a>
            )
          )}

          <div className="pt-4 border-t border-gray-700 space-y-3">
            {/* Mobile User Profile or Sign In */}
            {isLoggedIn ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 px-3 py-2 bg-gray-800/50 rounded-lg">
                  {userData.image ? (
                    <img
                      src={userData.image}
                      alt={userData.name || "Profile"}
                      className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                    />
                  ) : (
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-10 h-10 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-white">
                        {userData.name?.charAt(0) || "U"}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-white">
                      {userData.name || "User"}
                    </div>
                    {userData.title && (
                      <div className="text-xs text-gray-400">
                        {userData.title}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    toggleMobileMenu();
                    handleLogoutWithRedirect(); // Using the redirect version
                  }}
                  className="block w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  toggleLogin();
                  toggleMobileMenu();
                }}
                className="block w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-800 transition-colors"
              >
                Sign In
              </button>
            )}

            {/* Mobile Get Started / Dashboard Button */}
            <button
              onClick={() => {
                toggleMobileMenu();
                window.location.href = isLoggedIn ? "/dashboard" : "/signup";
              }}
              className="block w-full px-4 py-2 text-sm bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              {isLoggedIn ? "Go to Dashboard" : "Get Started"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
