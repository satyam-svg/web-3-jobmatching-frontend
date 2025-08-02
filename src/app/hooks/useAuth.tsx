import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { FormDataType, UserData } from "../types";
import { DEFAULT_USER_DATA } from "../utils/constants";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData>(DEFAULT_USER_DATA);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch user data from API and transform it into UserData format
  const fetchUserData = async (userId: string): Promise<UserData | null> => {
    try {
      const response = await fetch(
        `https://web3-job-platform.onrender.com/user/${userId}`
      );
      if (!response.ok) throw new Error("Failed to fetch user data");

      const data = await response.json();

      const transformedData: UserData = {
        name: data.user.full_name || "User",
        title: data.user.title || "Professional",
        status: "Active now",
        experience: data.user.experience || "",
        location: data.user.location || "",
        currentCompany: data.user.current_company || "",
        phone: data.user.phone || "",
        email: data.user.email || "",
        linkedin: data.user.linkedin || "",
        github: data.user.github || "",
        portfolio: data.user.portfolio || "",
        skills: data.user.skills || [],
        education: data.user.education || "",
        institution: data.user.institution || "",
        image: data.user.image || "",
        role: data.user.role || "",
      };

      console.log("Transformed API data:", transformedData);
      return transformedData;
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data");
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = Cookies.get("token");
      const userCookie = Cookies.get("user");

      if (token && userCookie) {
        try {
          const parsedUser: Partial<UserData> & { id?: string } =
            JSON.parse(userCookie);

          if (parsedUser.id) {
            const freshUserData = await fetchUserData(parsedUser.id);
            if (freshUserData) {
              setUserData(freshUserData);
            } else {
              setUserData({
                name: parsedUser.name || "User",
                title: parsedUser.title || "Professional",
                status: parsedUser.status || "Active now",
                experience: parsedUser.experience || "",
                location: parsedUser.location || "",
                currentCompany: parsedUser.currentCompany || "",
                phone: parsedUser.phone || "",
                email: parsedUser.email || "",
                linkedin: parsedUser.linkedin || "",
                github: parsedUser.github || "",
                portfolio: parsedUser.portfolio || "",
                skills: parsedUser.skills || [],
                education: parsedUser.education || "",
                institution: parsedUser.institution || "",
                image: parsedUser.image || "",
                role: parsedUser.role || "",
              });
            }
          }

          setIsLoggedIn(true);
        } catch (error) {
          console.error("Error parsing user data:", error);
          toast.error("Failed to load user data");
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const handleLogin = useCallback((data: FormDataType) => {
    const transformedData: UserData = {
      name: data.name,
      title: data.title || "Professional",
      status: data.status || "Active now",
      experience: data.experience || "",
      location: data.location || "",
      currentCompany: data.currentCompany || "",
      phone: data.phone || "",
      email: data.email || "",
      linkedin: data.linkedin || "",
      github: data.github || "",
      portfolio: data.portfolio || "",
      skills: data.skills || [],
      education: data.education || "",
      institution: data.institution || "",
      image: data.image || "",
      role: data.role || "",
    };

    setUserData(transformedData);
    setIsLoggedIn(true);
  }, []);

  const handleLogout = useCallback(() => {
    Cookies.remove("token");
    Cookies.remove("user");
    setUserData(DEFAULT_USER_DATA);
    setIsLoggedIn(false);
    toast.success("Logged out successfully!");
  }, []);

  const toggleLogin = useCallback(() => {
    setIsLoggedIn((prev) => !prev);
  }, []);

  return {
    isLoggedIn,
    userData,
    loading,
    handleLogin,
    handleLogout,
    toggleLogin,
  };
};
