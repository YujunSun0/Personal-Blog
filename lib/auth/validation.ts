import type { LoginFormData, LoginFormErrors } from '@/types/auth';

export function validateLoginForm(formData: LoginFormData): LoginFormErrors {
  const errors: LoginFormErrors = {};

  // 이메일 유효성 검사
  if (!formData.email.trim()) {
    errors.email = '이메일을 입력해주세요.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = '올바른 이메일 형식이 아닙니다.';
  }

  // 비밀번호 유효성 검사
  if (!formData.password) {
    errors.password = '비밀번호를 입력해주세요.';
  } else if (formData.password.length < 6) {
    errors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
  }

  return errors;
}

