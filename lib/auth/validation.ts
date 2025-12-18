import type { LoginFormData, LoginFormErrors, SignupFormData, SignupFormErrors } from '@/types/auth';

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

export function validateSignupForm(formData: SignupFormData): SignupFormErrors {
  const errors: SignupFormErrors = {};

  // 닉네임 유효성 검사
  const trimmedNickname = formData.nickname.trim();
  if (!trimmedNickname) {
    errors.nickname = '닉네임을 입력해주세요.';
  } else if (trimmedNickname.length < 2) {
    errors.nickname = '닉네임은 최소 2자 이상이어야 합니다.';
  } else if (trimmedNickname.length > 20) {
    errors.nickname = '닉네임은 최대 20자까지 입력 가능합니다.';
  } else if (!/^[a-zA-Z0-9가-힣_]+$/.test(trimmedNickname)) {
    errors.nickname = '닉네임은 영문, 숫자, 한글, 언더스코어(_)만 사용 가능합니다.';
  }

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
  } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(formData.password)) {
    errors.password = '비밀번호는 영문과 숫자를 포함해야 합니다.';
  }

  // 비밀번호 확인 유효성 검사
  if (!formData.confirmPassword) {
    errors.confirmPassword = '비밀번호 확인을 입력해주세요.';
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
  }

  return errors;
}

