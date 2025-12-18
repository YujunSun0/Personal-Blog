import type { Tag } from '@/types/tag';
import { TagBadge } from '@/components/tag/TagBadge';

interface PostTagsProps {
  tags: Tag[];
}

export function PostTags({ tags }: PostTagsProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <TagBadge key={tag.id} name={tag.name} size="sm" />
      ))}
    </div>
  );
}

