import { useRouter } from "next/navigation"; // ✅ Import useRouter for navigation

interface UserData {
  name?: string;
  title?: string;
  status?: string;
  image?: string;
  role?: string; // Added role field
}

interface ProfileCardProps {
  isLoggedIn: boolean;
  toggleLogin: () => void;
  openSignupPopup: () => void;
  userData: {
    name?: string;
    title?: string;
    status?: string;
    image?: string;
    role?: string;
  };
}
export default function ProfileCard({
  isLoggedIn,
  toggleLogin,
  openSignupPopup,
  userData,
}: ProfileCardProps) {
  // Debug log to see what's being passed
  console.log("ProfileCard received userData:", userData);

  return (
    <div className="p-4 sm:p-6">
      {!isLoggedIn ? (
        <UnauthenticatedView openSignupPopup={openSignupPopup} />
      ) : (
        <AuthenticatedView toggleLogin={toggleLogin} userData={userData} />
      )}
    </div>
  );
}

interface UnauthenticatedViewProps {
  openSignupPopup: () => void;
}

const UnauthenticatedView = ({ openSignupPopup }: UnauthenticatedViewProps) => (
  <div className="text-center py-8">
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-4 flex items-center justify-center">
      <svg
        className="w-8 h-8 sm:w-10 sm:h-10 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        ></path>
      </svg>
    </div>
    <h3 className="text-lg sm:text-xl font-bold mb-2">
      Welcome to CareerConnect
    </h3>
    <p className="text-gray-400 text-sm mb-6">
      Sign in to view your personalized profile and career insights
    </p>
    <button
      onClick={openSignupPopup}
      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-sm hover:from-purple-700 hover:to-blue-700 transition-all"
    >
      Sign In to View Profile
    </button>
  </div>
);

interface AuthenticatedViewProps {
  toggleLogin: () => void;
  userData: UserData;
}

const AuthenticatedView = ({
  toggleLogin,
  userData,
}: AuthenticatedViewProps) => {
  const router = useRouter(); // ✅ Initialize router

  // ✅ Function to handle role-specific actions
  const handleRoleAction = () => {
    const userRole = userData.role || "applicant"; // Default to applicant for testing

    if (userRole === "applicant") {
      console.log("Navigating to job opportunities");
      router.push("/Jobs"); // ✅ Redirect to /Jobs
    } else if (userRole === "recruiter") {
      console.log("Opening job posting form");
      router.push("/recruiter"); // ✅ Redirect to /recruiter
    }
  };

  // ✅ Function to get button text based on role
  const getButtonText = () => {
    const userRole = userData.role || "applicant";
    return userRole === "applicant"
      ? "View Opportunities"
      : "Post Opportunities";
  };

  // ✅ Function to get button styles based on role
  const getButtonStyles = () => {
    const userRole = userData.role || "applicant";
    if (userRole === "applicant") {
      return "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800";
    } else if (userRole === "recruiter") {
      return "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800";
    }
    return "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"; // fallback
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <div className="flex space-x-3 sm:space-x-4">
          <div className="relative">
            {userData.image ? (
              <img
                src={userData.image}
                alt={userData.name || "Profile"}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-blue-500"
              />
            ) : (
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center">
                <span className="text-lg sm:text-2xl font-bold text-white">
                  {userData.name?.charAt(0) || "J"}
                </span>
              </div>
            )}
            <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-lg">
              Welcome, {userData.name || "John Carter"}
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm">
              {userData.title || "Product Designer"}
            </p>
          </div>
        </div>
        <div className="bg-green-900/30 text-green-400 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs">
          {userData.status || "Active now"}
        </div>
      </div>

      <div className="mb-4 sm:mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-400 text-xs sm:text-sm">
            Profile Strength
          </span>
          <span className="font-medium text-xs sm:text-sm">85%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 sm:h-2.5">
          <div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 sm:h-2.5 rounded-full transition-all duration-1000"
            style={{ width: "85%" }}
          ></div>
        </div>
      </div>

      <StatsGrid />

      {/* ✅ Role-specific button with redirection */}
      <button
        onClick={handleRoleAction}
        className={`w-full mb-4 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all transform hover:scale-105 active:scale-95 ${getButtonStyles()}`}
      >
        {getButtonText()}
      </button>

      <div className="flex justify-between gap-2">
        <button className="flex-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-700 rounded-lg text-xs sm:text-sm hover:bg-gray-600 transition-colors">
          View Profile
        </button>
        <button
          onClick={toggleLogin}
          className="flex-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-xs sm:text-sm hover:from-purple-700 hover:to-blue-700 transition-all"
        >
          Logout
        </button>
      </div>
    </>
  );
};

const StatsGrid = () => (
  <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
    <StatCard value={24} color="blue" label="Connections" />
    <StatCard value={5} color="purple" label="Interviews" />
    <StatCard value={3} color="green" label="Offers" />
  </div>
);

interface StatCardProps {
  value: number;
  color: "blue" | "purple" | "green";
  label: string;
}

const StatCard = ({ value, color, label }: StatCardProps) => {
  const colorClasses = {
    blue: "text-blue-400",
    purple: "text-purple-400",
    green: "text-green-400",
  };

  return (
    <div className="bg-gray-900/50 p-2 sm:p-4 rounded-xl text-center hover:bg-gray-900/70 transition-colors">
      <div className={`text-lg sm:text-2xl font-bold ${colorClasses[color]}`}>
        {value}
      </div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );
};
