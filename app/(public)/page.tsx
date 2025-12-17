export default function Home() {
  return (
    <main className="max-w-[var(--container-max-width)] mx-auto px-[var(--container-padding-x)] py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">
          개인 기술 블로그
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)]">
          기술 학습 및 실무 경험을 기록하는 공간입니다.
        </p>
      </div>
    </main>
  );
}

