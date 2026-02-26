// Auth feature types

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role?: string;
  [key: string]: any;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

// Base registration fields common to all roles
export interface BaseRegistrationRequest {
  name: string;
  email: string;
  mobile: string;
  password: string;
  password_confirmation: string;
  terms_accepted: "1";
  latitude?: string;
  longitude?: string;
}

// Owner registration
export interface OwnerRegistrationRequest extends BaseRegistrationRequest {
  role: "owner";
  whatsapp?: string;
  backup_mobile?: string;
}

// Agent registration
export interface AgentRegistrationRequest extends BaseRegistrationRequest {
  role: "agent";
  fal_number: string;
  agent_type?: "individual" | "office";
  company_name?: string;
  company_logo?: File;
  whatsapp?: string;
  backup_mobile?: string;
}

// Developer registration
export interface DeveloperRegistrationRequest extends BaseRegistrationRequest {
  role: "developer";
  type: "developer";
  company_name: string;
  company_logo: File;
  commercial_register: string;
  whatsapp?: string;
  backup_mobile?: string;
}

// Seeker registration
export interface SeekerRegistrationRequest extends BaseRegistrationRequest {
  role: "seeker";
}

// Union type for all registration requests
export type RegistrationRequest =
  | OwnerRegistrationRequest
  | AgentRegistrationRequest
  | DeveloperRegistrationRequest
  | SeekerRegistrationRequest;

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  password: string;
  password_confirmation: string;
}
export interface UpdateFcmTokenRequest {
  fcm_token: string;
}
