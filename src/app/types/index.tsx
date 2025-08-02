export interface FormDataType {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  title: string;
  experience: string;
  skills: string[];
  education: string;
  institution: string;
  location: string;
  status: string;
  resume: File | null;
  linkedin: string;
  portfolio: string;
  github: string;
  currentCompany: string;
  jobType: string;
  remotePreference: string;
  image: string;
  role: string; // ✅ Add this line
}

export interface UserData {
  name: string;
  title: string;
  status: string;
  experience: string;
  location: string;
  currentCompany: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  portfolio: string;
  skills: string[];
  education: string;
  institution: string;
  image: string;
  role?: string; // Make sure this exists
}

export interface SignupPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (formData: FormDataType) => void;
}

export interface HeroProps {
  isLoggedIn: boolean;
  toggleLogin: () => void;
}
