interface ExperienceItem {
  years?: string;
}

interface EducationItem {
  degree?: string;
  institution?: string;
}

export const mapExperienceLevel = (
  experienceArray: ExperienceItem[] | null | undefined
): string | null => {
  if (!experienceArray || experienceArray.length === 0) return null;

  let totalYears = 0;
  experienceArray.forEach((exp) => {
    if (exp.years) {
      const yearMatch = exp.years.match(/(\d+)/g);
      if (yearMatch) {
        totalYears += parseInt(yearMatch[0], 10) || 0;
      }
    }
  });

  if (totalYears === 0) return "Fresher";
  if (totalYears <= 3) return "1-3 years";
  if (totalYears <= 5) return "3-5 years";
  if (totalYears <= 10) return "5+ years";
  return "10+ years";
};

export const mapEducationLevel = (
  educationArray: EducationItem[] | null | undefined
): string | null => {
  if (!educationArray || educationArray.length === 0) return null;

  const degree = educationArray[0]?.degree?.toLowerCase() || "";

  if (degree.includes("bachelor")) return "Bachelor's Degree";
  if (degree.includes("master")) return "Master's Degree";
  if (degree.includes("phd") || degree.includes("doctorate")) return "PhD";
  return "Bachelor's Degree";
};

export const mapInstitutionFromEducation = (
  educationArray: EducationItem[] | null | undefined
): string | null => {
  if (!educationArray || educationArray.length === 0) return null;
  return educationArray[0]?.institution || null;
};

export const mapExperienceFromAPIResponse = (
  experienceArray: ExperienceItem[] | null | undefined
): string => {
  if (!experienceArray || experienceArray.length === 0) return "Fresher";

  let totalYears = 0;
  experienceArray.forEach((exp) => {
    if (exp.years) {
      const yearMatch = exp.years.match(/(\d+)/);
      if (yearMatch) {
        totalYears += parseInt(yearMatch[0], 10) || 0;
      }
    }
  });

  if (totalYears === 0) return "Fresher";
  if (totalYears <= 3) return "1-3 years";
  if (totalYears <= 5) return "3-5 years";
  if (totalYears <= 10) return "5+ years";
  return "10+ years";
};
