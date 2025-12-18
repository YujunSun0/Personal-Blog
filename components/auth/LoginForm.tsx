'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import type { LoginFormData, LoginFormErrors } from '@/types/auth';
import { validateLoginForm } from '@/lib/auth/validation';

export function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [loading, setLoading] = useState(false);
  const { signInWithEmail, role } = useAuth();
  const router = useRouter();

  const handleValidate = (): boolean => {
    const validationErrors = validateLoginForm(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleChange = (field: keyof LoginFormData) => (
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

    // 유효성 검사
    if (!handleValidate()) {
      return;
    }

    setLoading(true);

    const { error } = await signInWithEmail(formData.email, formData.password);

    if (error) {
      toast.error('로그인 실패', {
        description: error.message,
      });
      setErrors({ general: error.message });
      setLoading(false);
    } else {
      toast.success('로그인 성공', {
        description: '환영합니다!',
      });
      // 역할이 로드될 때까지 잠시 대기 후 리다이렉트
      setTimeout(() => {
        // URL 파라미터에서 리다이렉트 경로 확인
        const searchParams = new URLSearchParams(window.location.search);
        const redirectedFrom = searchParams.get('redirectedFrom');
        
        // 관리자인 경우 대시보드로, 일반 사용자는 홈으로
        // 또는 리다이렉트 경로가 관리자 페이지인 경우에만 대시보드로
        if (redirectedFrom && redirectedFrom.startsWith('/dashboard')) {
          router.push('/dashboard');
        } else {
          router.push('/');
        }
        router.refresh();
      }, 500);
    }
  };

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
          placeholder="비밀번호를 입력하세요"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
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
        {loading ? '로그인 중...' : '로그인'}
      </button>
    </form>
  );
}

