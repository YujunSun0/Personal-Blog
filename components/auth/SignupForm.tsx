'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { SignupFormData, SignupFormErrors } from '@/types/auth';
import { validateSignupForm } from '@/lib/auth/validation';

export function SignupForm() {
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
  });
  const [errors, setErrors] = useState<SignupFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleValidate = (): boolean => {
    const validationErrors = validateSignupForm(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleChange = (field: keyof SignupFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    // 입력 시 해당 필드의 에러 제거
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    // 유효성 검사
    if (!handleValidate()) {
      return;
    }

    setLoading(true);

    // 이메일 정규화 (trim 처리)
    const normalizedEmail = formData.email.trim();
    const normalizedNickname = formData.nickname.trim();
    const { data: signUpData, error } = await signUp(normalizedEmail, formData.password);

    if (error) {
      // Supabase 에러 메시지를 사용자 친화적으로 변환
      let errorMessage = error.message;
      if (error.message.includes('email_address_invalid')) {
        errorMessage = '유효하지 않은 이메일 주소입니다.';
      } else if (error.message.includes('already registered')) {
        errorMessage = '이미 등록된 이메일입니다.';
      } else if (error.message.includes('password')) {
        errorMessage = '비밀번호가 요구사항을 만족하지 않습니다.';
      }
      toast.error('회원가입 실패', {
        description: errorMessage,
      });
      setErrors({ general: errorMessage });
      setLoading(false);
    } else {
      // 회원가입 성공 시 프로필에 닉네임 저장
      if (signUpData?.user) {
        const supabase = createClient();
        // 타입 단언을 사용하여 업데이트
        const updateData: { nickname: string } = { nickname: normalizedNickname };
        const { error: profileError } = await (supabase
          .from('profiles')
          .update(updateData as never)
          .eq('user_id', signUpData.user.id) as any);

        if (profileError) {
          console.error('프로필 업데이트 실패:', profileError);
          // 프로필 업데이트 실패해도 회원가입은 성공한 상태이므로 계속 진행
        }
      }

      toast.success('회원가입 완료', {
        description: '이메일을 확인하여 계정을 활성화해주세요.',
      });
      setSuccess(true);
      setLoading(false);
      // 이메일 확인 메시지 표시 후 로그인 페이지로 리다이렉트
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="text-green-600 text-lg font-semibold">
          회원가입이 완료되었습니다!
        </div>
        <div className="text-sm text-[var(--color-text-secondary)]">
          이메일을 확인하여 계정을 활성화해주세요.
          <br />
          잠시 후 로그인 페이지로 이동합니다...
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          이메일
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.email
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="your@email.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange('password')}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.password
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="영문과 숫자를 포함한 6자 이상"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
          비밀번호 확인
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.confirmPassword
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="비밀번호를 다시 입력하세요"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
        )}
      </div>

      <div>
        <label htmlFor="nickname" className="block text-sm font-medium mb-1">
          닉네임
        </label>
        <input
          id="nickname"
          type="text"
          value={formData.nickname}
          onChange={handleChange('nickname')}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.nickname
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="닉네임을 입력하세요 (2-20자)"
          maxLength={20}
        />
        {errors.nickname && (
          <p className="mt-1 text-sm text-red-600">{errors.nickname}</p>
        )}
      </div>

      {errors.general && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
          {errors.general}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? '회원가입 중...' : '회원가입'}
      </button>
    </form>
  );
}
