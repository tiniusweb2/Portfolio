export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export interface FormState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  hasError: boolean;
  errorMessage?: string;
} 