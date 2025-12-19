import Link from 'next/link';

interface TagBadgeProps {
  name: string;
  href?: string;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline';
}

export function TagBadge({ name, href, count, size = 'md', variant = 'default' }: TagBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const variantClasses = {
    default: 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]',
    outline: 'border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]',
  };

  const className = `inline-flex items-center gap-1 rounded-md transition-colors ${sizeClasses[size]} ${variantClasses[variant]}`;

  const content = (
    <>
      <span>{name}</span>
      {count !== undefined && count > 0 && (
        <span className="text-[var(--color-text-tertiary)]">({count})</span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return <span className={className}>{content}</span>;
}



