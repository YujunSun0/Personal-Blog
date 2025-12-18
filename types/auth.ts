export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
}

export interface SignupFormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  nickname?: string;
  general?: string;
}

