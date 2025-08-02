import { useState } from "react";
import toast from "react-hot-toast";
import { apiService } from "../services/api";
import {
  mapExperienceLevel,
  mapEducationLevel,
  mapInstitutionFromEducation,
} from "../utils/helpers";
import { FormDataType } from "../types";

export const useResumeParser = (formData: FormDataType) => {
  const [parseError, setParseError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const parseResumeWithAPI = async (file: File) => {
    try {
      const parsedData = await apiService.uploadResume(file);

      const mappedData = {
        name: parsedData.full_name || formData.name,
        email: parsedData.email || formData.email,
        phone: parsedData.phone || formData.phone,
        title: parsedData.title || formData.title,
        currentCompany: parsedData.current_company || formData.currentCompany,
        location: parsedData.location || formData.location,
        linkedin: parsedData.linkedin || formData.linkedin,
        portfolio: parsedData.portfolio || formData.portfolio,
        github: parsedData.github || formData.github,
        skills: parsedData.skills || formData.skills,
        experience:
          mapExperienceLevel(parsedData.experience) || formData.experience,
        education:
          mapEducationLevel(parsedData.education) || formData.education,
        institution:
          mapInstitutionFromEducation(parsedData.education) ||
          formData.institution,
      };

      return mappedData;
    } catch (error) {
      console.error("Resume parsing error:", error);
      throw new Error(
        "Failed to parse resume. Please try again or fill the form manually."
      );
    }
  };

  const handleFileChange = async (
    file: File,
    onSuccess: (parsedData: unknown) => void,
    onUpdateFormData: (file: File) => void
  ) => {
    setIsLoading(true);
    setParseError("");

    const parsingToast = toast.loading("Parsing resume...");
    onUpdateFormData(file);

    try {
      const parsedData = await parseResumeWithAPI(file);
      onSuccess(parsedData);
      toast.success("Resume parsed successfully!", { id: parsingToast });
    } catch (error) {
      console.error("Resume parsing failed:", error);
      setParseError(
        error instanceof Error ? error.message : "Failed to parse resume"
      );
      toast.error("Failed to parse resume. Please try again.", {
        id: parsingToast,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    parseError,
    isLoading,
    handleFileChange,
    setParseError,
  };
};
