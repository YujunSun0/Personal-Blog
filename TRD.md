# 기술 요구사항 문서 (TRD)

## 1. 프로젝트 개요

본 문서는 개인 기술 블로그 프로젝트의 기술적 구현 방안을 정의합니다.

**기술 스택:**
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui (선택)
- Supabase (Auth, Database, Storage)
- Vercel (배포)

---

## 2. 아키텍처 패턴

### 2.1 사용된 아키텍처 패턴

본 프로젝트는 **Feature-based Architecture (기능 기반 아키텍처)**와 **Layered Architecture (계층형 아키텍처)**를 혼합한 하이브리드 구조를 사용합니다.

#### A. Feature-based Architecture (기능 기반)
**특징:**
- 도메인/기능별로 코드를 그룹화
- 관련된 코드를 한 곳에 모아 유지보수성 향상

**예시:**
```
components/
├── post/          # Post 도메인 관련 컴포넌트
├── tag/           # Tag 도메인 관련 컴포넌트
└── admin/         # Admin 기능 관련 컴포넌트
```

**장점:**
- 기능별로 코드를 쉽게 찾을 수 있음
- 기능 추가/수정 시 영향 범위가 명확함
- 팀 협업 시 충돌 최소화

#### B. Layered Architecture (계층형)
**특징:**
- 관심사에 따라 계층을 분리
- 각 계층의 책임이 명확함

**계층 구조:**
```
app/              # Presentation Layer (프레젠테이션 계층)
components/       # UI Layer (UI 계층)
hooks/            # Business Logic Layer (비즈니스 로직 계층)
lib/              # Infrastructure Layer (인프라 계층)
types/            # Domain Layer (도메인 계층)
```

**장점:**
- 관심사 분리가 명확함
- 테스트 용이성
- 재사용성 향상

### 2.2 DDD (Domain-Driven Design)와의 차이점

#### DDD 접근 방식
```
src/
├── domains/
│   ├── post/
│   │   ├── entities/
│   │   ├── repositories/
│   │   ├── services/
│   │   └── value-objects/
│   └── tag/
│       ├── entities/
│       └── repositories/
├── application/
└── infrastructure/
```

**DDD 특징:**
- 도메인 모델 중심 설계
- 엔티티, 값 객체, 리포지토리 등 명확한 도메인 개념
- 복잡한 비즈니스 로직에 적합
- 백엔드 중심 아키텍처

#### 현재 구조와의 차이
| 구분 | DDD | 현재 구조 |
|------|-----|----------|
| **목적** | 복잡한 비즈니스 로직 관리 | 프론트엔드 중심, 빠른 개발 |
| **복잡도** | 높음 (엔티티, 리포지토리 등) | 낮음 (컴포넌트 중심) |
| **적합성** | 대규모 백엔드 시스템 | 중소규모 프론트엔드 프로젝트 |
| **학습 곡선** | 높음 | 낮음 |

### 2.3 현재 구조 선택 이유

**프로젝트 특성:**
- 개인 블로그 (단순한 CRUD)
- 프론트엔드 중심 프로젝트
- 빠른 개발 및 배포 필요
- 1인 개발

**현재 구조의 장점:**
- ✅ Next.js App Router와 자연스럽게 통합
- ✅ 학습 곡선이 낮음
- ✅ 작은 프로젝트에 적합
- ✅ 유지보수가 쉬움

**DDD가 과한 이유:**
- ❌ 단순한 CRUD 작업에 과도한 추상화
- ❌ 프론트엔드에서는 도메인 로직이 단순함
- ❌ 개발 시간 증가
- ❌ 오버 엔지니어링 위험

### 2.4 향후 DDD 도입 고려사항

프로젝트가 복잡해지면 다음과 같이 DDD 요소를 도입할 수 있습니다:

```
lib/
├── domains/
│   ├── post/
│   │   ├── post.entity.ts       # Post 엔티티
│   │   ├── post.repository.ts   # Post 리포지토리
│   │   └── post.service.ts      # Post 서비스
│   └── tag/
│       ├── tag.entity.ts
│       └── tag.repository.ts
```

**도입 시점:**
- 비즈니스 로직이 복잡해질 때
- 여러 개발자가 협업할 때
- 도메인 규칙이 많아질 때

---

## 3. 프로젝트 폴더 구조

### 3.1 전체 구조

```
yujunsun_blog/
├── app/                          # Next.js App Router
│   ├── (public)/                 # 공개 페이지 그룹
│   │   ├── layout.tsx            # 공개 페이지 레이아웃
│   │   ├── page.tsx              # 메인 페이지 (글 목록)
│   │   ├── posts/
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx      # 글 상세 페이지
│   │   │   └── page.tsx           # 전체 글 목록
│   │   └── tags/
│   │       └── [tag]/
│   │           └── page.tsx      # 태그별 글 목록
│   ├── (admin)/                  # 관리자 페이지 그룹
│   │   ├── layout.tsx             # 관리자 레이아웃
│   │   ├── login/
│   │   │   └── page.tsx           # 로그인 페이지
│   │   ├── dashboard/
│   │   │   ├── page.tsx          # 대시보드 (Draft 목록)
│   │   │   └── posts/
│   │   │       ├── new/
│   │   │       │   └── page.tsx  # 새 글 작성
│   │   │       └── [id]/
│   │   │           └── edit/
│   │   │               └── page.tsx # 글 수정
│   │   └── api/                  # 관리자 API 라우트
│   │       └── upload/
│   │           └── route.ts      # 이미지 업로드
│   ├── api/                      # 공개 API 라우트
│   │   └── posts/
│   │       └── route.ts          # 글 목록 API (필요시)
│   ├── globals.css               # 전역 스타일
│   ├── layout.tsx                # 루트 레이아웃
│   └── not-found.tsx             # 404 페이지
├── components/                   # 재사용 컴포넌트
│   ├── ui/                       # shadcn/ui 컴포넌트
│   ├── layout/                   # 레이아웃 컴포넌트
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx           # 태그 필터 사이드바
│   ├── post/                     # 글 관련 컴포넌트
│   │   ├── PostCard.tsx          # 글 카드 (목록용)
│   │   ├── PostContent.tsx       # 글 내용 (Markdown 렌더링)
│   │   ├── PostHeader.tsx        # 글 헤더 (제목, 날짜, 태그)
│   │   └── PostTags.tsx          # 태그 표시
│   ├── tag/                      # 태그 관련 컴포넌트
│   │   ├── TagList.tsx           # 태그 목록
│   │   ├── TagFilter.tsx         # 태그 필터 (Velog 스타일)
│   │   └── TagBadge.tsx          # 태그 뱃지
│   ├── admin/                    # 관리자 전용 컴포넌트
│   │   ├── PostEditor.tsx        # 글 작성/수정 에디터
│   │   ├── PostForm.tsx         # 글 작성 폼
│   │   ├── ImageUploader.tsx    # 이미지 업로드
│   │   ├── DraftList.tsx        # Draft 목록
│   │   ├── LoginForm.tsx        # Email 로그인 폼
│   │   └── SocialLoginButtons.tsx # 소셜 로그인 버튼 (GitHub, Google)
│   ├── markdown/                 # Markdown 관련 컴포넌트
│   │   ├── CodeBlock.tsx         # 코드 블록 (하이라이팅)
│   │   └── MarkdownRenderer.tsx  # Markdown 렌더러
│   └── comment/                  # 댓글 관련 컴포넌트
│       ├── CommentList.tsx       # 댓글 목록
│       ├── CommentItem.tsx       # 댓글 아이템
│       ├── CommentForm.tsx       # 댓글 작성 폼 (회원)
│       └── NonMemberCommentForm.tsx # 비회원 댓글 작성 폼
├── lib/                          # 유틸리티 및 설정
│   ├── supabase/
│   │   ├── client.ts            # Supabase 클라이언트
│   │   ├── server.ts            # Supabase 서버 클라이언트
│   │   └── types.ts              # Database 타입
│   ├── utils/
│   │   ├── date.ts              # 날짜 포맷팅
│   │   ├── markdown.ts          # Markdown 처리
│   │   └── cn.ts                # className 유틸 (shadcn)
│   └── constants/
│       ├── routes.ts             # 라우트 상수
│       └── config.ts             # 설정 상수
├── hooks/                        # Custom Hooks
│   ├── useAuth.ts               # 인증 관련
│   ├── usePosts.ts              # 글 목록 조회
│   ├── useTags.ts               # 태그 조회
│   └── useImageUpload.ts        # 이미지 업로드
├── types/                        # TypeScript 타입 정의
│   ├── post.ts                  # Post 타입
│   ├── tag.ts                   # Tag 타입
│   └── image.ts                 # Image 타입
├── styles/                       # 스타일 파일
│   └── markdown.css             # Markdown 스타일
├── public/                       # 정적 파일
│   ├── images/
│   └── favicon.ico
├── .env.local                    # 환경 변수 (로컬)
├── .env.example                  # 환경 변수 예시
├── next.config.js               # Next.js 설정
├── tailwind.config.ts           # Tailwind 설정
├── tsconfig.json                # TypeScript 설정
└── package.json
```

### 3.2 주요 디렉토리 설명

#### `app/` - Next.js App Router
- **`(public)/`**: 공개 페이지 그룹 (Route Group)
  - 방문자가 접근하는 모든 페이지
  - SSG/ISR 적용 대상
- **`(admin)/`**: 관리자 페이지 그룹
  - 인증이 필요한 페이지
  - SSR 적용 (동적 데이터)
- **`api/`**: API 라우트
  - 서버 사이드 로직 처리

#### `components/` - 재사용 컴포넌트
- **기능별 분리**: `post/`, `tag/`, `admin/` 등
- **레이아웃 컴포넌트**: 공통으로 사용되는 Header, Footer 등
- **UI 컴포넌트**: shadcn/ui 기반 기본 컴포넌트

#### `lib/` - 유틸리티 및 설정
- **`supabase/`**: Supabase 클라이언트 및 타입
- **`utils/`**: 공통 유틸리티 함수
- **`constants/`**: 상수 정의

#### `hooks/` - Custom Hooks
- 데이터 페칭 및 상태 관리 로직 재사용

#### `types/` - TypeScript 타입
- 도메인 모델 타입 정의

---

## 4. 컴포넌트 분리 기준

### 4.1 분리 원칙

#### 1. 단일 책임 원칙 (SRP)
각 컴포넌트는 하나의 명확한 책임만 가져야 합니다.

**예시:**
- ✅ `PostCard.tsx`: 글 카드 UI만 담당
- ✅ `PostContent.tsx`: Markdown 렌더링만 담당
- ❌ `PostCard.tsx`: 글 카드 + 태그 필터링 + API 호출

#### 2. 재사용성 우선
여러 곳에서 사용되는 UI는 컴포넌트로 분리합니다.

**예시:**
- `TagBadge.tsx`: 글 상세, 글 목록, 태그 필터에서 모두 사용
- `PostCard.tsx`: 메인 페이지, 태그 페이지에서 재사용

#### 3. 관심사 분리
UI 컴포넌트와 비즈니스 로직을 분리합니다.

**예시:**
- 컴포넌트: UI 렌더링만 담당
- Custom Hook: 데이터 페칭 및 상태 관리
- API Route: 서버 사이드 로직

### 4.2 컴포넌트 분류

#### A. Presentational Components (표현 컴포넌트)
**역할**: UI만 담당, props로 데이터를 받음

**예시:**
```typescript
// components/post/PostCard.tsx
interface PostCardProps {
  post: Post;
  onClick?: () => void;
}

export function PostCard({ post, onClick }: PostCardProps) {
  return (
    <article onClick={onClick}>
      <h2>{post.title}</h2>
      <p>{post.description}</p>
      <PostTags tags={post.tags} />
    </article>
  );
}
```

**특징:**
- props로 데이터를 받음
- 상태 관리 없음 (또는 로컬 상태만)
- 재사용 가능
- 테스트 용이

#### B. Container Components (컨테이너 컴포넌트)
**역할**: 데이터 페칭 및 상태 관리

**예시:**
```typescript
// app/(public)/page.tsx
export default async function HomePage() {
  const posts = await getPublishedPosts();
  const tags = await getAllTags();
  
  return (
    <div>
      <TagFilter tags={tags} />
      <PostList posts={posts} />
    </div>
  );
}
```

**특징:**
- 서버 컴포넌트에서 데이터 페칭
- 클라이언트 컴포넌트는 Custom Hook 사용
- 페이지 레벨에서 주로 사용

#### C. Layout Components (레이아웃 컴포넌트)
**역할**: 페이지 구조 제공

**예시:**
- `Header.tsx`: 네비게이션, 로고
- `Footer.tsx`: 푸터 정보
- `Sidebar.tsx`: 태그 필터 사이드바

### 4.3 컴포넌트 분리 기준 체크리스트

컴포넌트를 분리할지 결정할 때:

- [ ] **재사용 여부**: 2곳 이상에서 사용되는가?
- [ ] **복잡도**: 100줄 이상인가?
- [ ] **책임 분리**: 다른 책임을 가진 로직이 섞여 있는가?
- [ ] **테스트 용이성**: 독립적으로 테스트하기 어려운가?
- [ ] **가독성**: 분리하면 코드가 더 읽기 쉬워지는가?

**예시:**
```typescript
// ❌ 분리 전: 하나의 컴포넌트에 모든 로직
function PostPage() {
  const [post, setPost] = useState();
  const [tags, setTags] = useState();
  // ... 많은 로직
  
  return (
    <div>
      {/* 긴 JSX */}
    </div>
  );
}

// ✅ 분리 후: 책임별로 분리
function PostPage() {
  const post = usePost();
  const tags = useTags();
  
  return (
    <div>
      <PostHeader post={post} />
      <PostContent content={post.content} />
      <PostTags tags={tags} />
    </div>
  );
}
```

---

## 5. 파일 네이밍 컨벤션

### 5.1 컴포넌트 파일
- **PascalCase** 사용
- 파일명과 컴포넌트명 일치

**예시:**
```
PostCard.tsx        → export function PostCard()
TagFilter.tsx       → export function TagFilter()
MarkdownRenderer.tsx → export function MarkdownRenderer()
```

### 5.2 유틸리티 파일
- **camelCase** 사용

**예시:**
```
date.ts      → export function formatDate()
markdown.ts  → export function parseMarkdown()
```

### 5.3 타입 파일
- **camelCase** 사용
- 단수형 사용

**예시:**
```
post.ts  → export type Post
tag.ts   → export type Tag
```

### 5.4 Hook 파일
- **camelCase** 사용
- `use` 접두사 사용

**예시:**
```
useAuth.ts      → export function useAuth()
usePosts.ts     → export function usePosts()
```

### 5.5 페이지 파일
- Next.js App Router 규칙 준수
- `page.tsx`, `layout.tsx`, `loading.tsx` 등

---

## 6. 코드 구조 가이드

### 6.1 컴포넌트 구조

```typescript
// 1. Imports (외부 라이브러리 → 내부 모듈)
import { useState } from 'react';
import { formatDate } from '@/lib/utils/date';
import { PostCard } from '@/components/post/PostCard';

// 2. Types & Interfaces
interface PostListProps {
  posts: Post[];
}

// 3. Component
export function PostList({ posts }: PostListProps) {
  // 4. Hooks
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // 5. Computed Values
  const filteredPosts = selectedTag
    ? posts.filter(post => post.tags.includes(selectedTag))
    : posts;
  
  // 6. Event Handlers
  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
  };
  
  // 7. Render
  return (
    <div>
      {filteredPosts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

### 6.2 서버 컴포넌트 vs 클라이언트 컴포넌트

#### 서버 컴포넌트 (기본)
- 데이터 페칭
- 정적 콘텐츠 렌더링
- SEO 중요 페이지

**예시:**
```typescript
// app/(public)/page.tsx
export default async function HomePage() {
  const posts = await getPublishedPosts();
  
  return <PostList posts={posts} />;
}
```

#### 클라이언트 컴포넌트
- 인터랙션 필요 (onClick, onChange 등)
- useState, useEffect 사용
- 브라우저 API 사용

**예시:**
```typescript
'use client';

import { useState } from 'react';

export function TagFilter({ tags }: TagFilterProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  return (
    <div>
      {tags.map(tag => (
        <button onClick={() => setSelectedTag(tag.id)}>
          {tag.name}
        </button>
      ))}
    </div>
  );
}
```

### 6.3 데이터 페칭 패턴

#### 서버 컴포넌트에서 직접 페칭
```typescript
// app/(public)/posts/[slug]/page.tsx
export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }
  
  return <PostContent post={post} />;
}
```

#### Custom Hook 사용 (클라이언트 컴포넌트)
```typescript
// hooks/usePosts.ts
export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchPosts().then(setPosts).finally(() => setLoading(false));
  }, []);
  
  return { posts, loading };
}
```

---

## 7. 상태 관리 전략

### 7.1 서버 상태 (Server State)
- **도구**: React Server Components + Server Actions
- **용도**: 데이터베이스에서 가져온 데이터

**예시:**
```typescript
// Server Component
export default async function PostList() {
  const posts = await getPosts(); // 서버에서 직접 페칭
  return <PostList posts={posts} />;
}
```

### 7.2 클라이언트 상태 (Client State)
- **도구**: useState, useReducer
- **용도**: UI 상태 (모달 열림/닫힘, 필터 선택 등)

**예시:**
```typescript
'use client';

export function TagFilter() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  // ...
}
```

### 7.3 전역 상태
- **도구**: Context API (필요시)
- **용도**: 인증 상태, 테마 등

**예시:**
```typescript
// contexts/AuthContext.tsx
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // ...
}
```

---

## 8. 스타일링 전략

### 8.1 Tailwind CSS 사용
- 유틸리티 클래스 우선 사용
- 반복되는 스타일은 컴포넌트로 추출

**예시:**
```typescript
// ✅ 좋은 예
<button className="px-4 py-2 bg-blue-500 text-white rounded">
  버튼
</button>

// ❌ 나쁜 예 (인라인 스타일)
<button style={{ padding: '1rem', backgroundColor: 'blue' }}>
  버튼
</button>
```

### 8.2 CSS 모듈 (필요시)
- 컴포넌트별 고유 스타일이 필요한 경우

**예시:**
```typescript
// components/markdown/MarkdownRenderer.module.css
.markdown {
  /* Markdown 전용 스타일 */
}
```

### 8.3 shadcn/ui 활용
- 기본 UI 컴포넌트는 shadcn/ui 사용
- 커스터마이징은 Tailwind로 확장

---

## 9. 타입 정의 가이드

### 9.1 도메인 타입

```typescript
// types/post.ts
export type PostType = 'TECH' | 'TROUBLESHOOTING' | 'LIFE';

export interface Post {
  id: string;
  title: string;
  description: string;
  content: string; // Markdown
  type: PostType;
  thumbnailUrl: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
  images?: Image[];
}

export interface PostListItem {
  id: string;
  title: string;
  description: string;
  type: PostType;
  thumbnailUrl: string | null;
  createdAt: string;
  tags: Tag[];
}
```

### 9.2 Props 타입

```typescript
// 컴포넌트 Props는 같은 파일에 정의
interface PostCardProps {
  post: PostListItem;
  onClick?: () => void;
  className?: string;
}
```

### 9.3 API 응답 타입

```typescript
// lib/supabase/types.ts
export interface Database {
  public: {
    Tables: {
      posts: {
        Row: Post;
        Insert: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Insert>;
      };
      // ...
    };
  };
}
```

---

## 10. 에러 처리 전략

### 10.1 에러 바운더리
- 페이지 레벨에서 에러 처리

**예시:**
```typescript
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>문제가 발생했습니다</h2>
      <button onClick={reset}>다시 시도</button>
    </div>
  );
}
```

### 10.2 Not Found 처리
```typescript
// app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>페이지를 찾을 수 없습니다</h2>
    </div>
  );
}
```

### 10.3 데이터 페칭 에러
```typescript
// 서버 컴포넌트
export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    notFound(); // Next.js notFound() 사용
  }
  
  return <PostContent post={post} />;
}
```

---

## 11. 성능 최적화

### 11.1 이미지 최적화
- Next.js Image 컴포넌트 사용
- WebP 포맷 사용

**예시:**
```typescript
import Image from 'next/image';

<Image
  src={post.thumbnailUrl}
  alt={post.title}
  width={800}
  height={400}
  priority={isMainPost}
/>
```

### 11.2 코드 스플리팅
- 동적 import 사용

**예시:**
```typescript
// 관리자 페이지는 필요할 때만 로드
const PostEditor = dynamic(() => import('@/components/admin/PostEditor'), {
  ssr: false,
});
```

### 11.3 캐싱 전략
- ISR (Incremental Static Regeneration) 활용

**예시:**
```typescript
// app/(public)/posts/[slug]/page.tsx
export const revalidate = 3600; // 1시간마다 재생성

export default async function PostPage({ params }: { params: { slug: string } }) {
  // ...
}
```

---

## 12. 보안 고려사항

### 12.1 환경 변수
- 민감한 정보는 `.env.local`에 저장
- `.env.local`은 Git에 커밋하지 않음

### 12.2 인증
- Supabase Auth 사용
- 서버 사이드에서 인증 확인

**예시:**
```typescript
// app/(admin)/dashboard/page.tsx
import { createServerClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }
  
  // ...
}
```

### 12.3 입력 검증
- 클라이언트와 서버 양쪽에서 검증

---

## 13. 테스트 전략 (추후)

### 13.1 단위 테스트
- 유틸리티 함수 테스트
- 컴포넌트 렌더링 테스트

### 13.2 통합 테스트
- 페이지 플로우 테스트
- API 라우트 테스트

---

## 14. 개발 워크플로우

### 14.1 브랜치 전략
- `main`: 프로덕션 배포
- `develop`: 개발 브랜치
- `feature/기능명`: 기능 개발

### 14.2 커밋 메시지
- Conventional Commits 형식 사용

**예시:**
```
feat: 글 작성 기능 추가
fix: 태그 필터링 버그 수정
refactor: PostCard 컴포넌트 리팩토링
docs: README 업데이트
```

---

## 15. 참고 자료

- [Next.js App Router 문서](https://nextjs.org/docs/app)
- [shadcn/ui 문서](https://ui.shadcn.com/)
- [Supabase 문서](https://supabase.com/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)

---

## 16. 결론

본 TRD는 기술 블로그 프로젝트의 기술적 구현 가이드를 제공합니다.

**핵심 원칙:**
- 단순함 유지
- 확장 가능한 구조
- 성능 최적화
- 유지보수 용이성

프로젝트 진행 중 필요에 따라 본 문서를 업데이트하며, 모든 변경사항은 문서에 반영합니다.

