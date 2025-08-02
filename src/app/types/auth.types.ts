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
    role: string;
  }
  
  export interface SignupPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (formData: FormDataType) => void;
  }
  
  export interface LoginData {
    email: string;
    password: string;
  }
  
  export interface SignupData {
    email: string;
    password: string;
    full_name: string;
    title: string;
    location: string;
    phone: string;
    current_company: string;
    linkedin: string;
    github: string;
    portfolio: string;
    skills: string;
    image: string;
    education: Array<{
      institution: string;
      location: string;
      degree: string;
      gpa: string;
      years: string;
    }>;
    experience: Array<{
      company: string;
      location: string;
      title: string;
      years: string;
      description: string;
    }>;
    role: string;
  }
  


  // Add this to your existing types
export interface ParsedResumeData {
  full_name?: string;
  email?: string;
  phone?: string;
  title?: string;
  current_company?: string;
  location?: string;
  linkedin?: string;
  portfolio?: string;
  github?: string;
  skills?: string[];
  experience?: Array<{ years?: string }>;
  education?: Array<{ degree?: string; institution?: string }>;
}


export interface SignupAPIResponse {
  token: string;
  user: {
    id: string;
    role: string;
    full_name?: string;
    title?: string;
    location?: string;
    current_company?: string;
    phone?: string;
    email?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    skills?: string;
    education?: Array<{
      degree?: string;
      institution?: string;
    }>;
    image?: string;
  };
}


export interface LoginAPIResponse {
  token: string;
  user: {
    id: string;
    role: string;
    full_name?: string;
    title?: string;
    location?: string;
    current_company?: string;
    phone?: string;
    email?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    skills?: string;
    education?: Array<{
      degree?: string;
      institution?: string;
    }>;
    image?: string;
  };
}