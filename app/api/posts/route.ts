import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createPost } from '@/lib/supabase/posts';
import { connectPostToTags } from '@/lib/supabase/tags';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { tags, ...postData } = body;
    
    const post = await createPost(postData);

    // 태그 연결
    if (tags && Array.isArray(tags) && tags.length > 0) {
      await connectPostToTags(post.id, tags);
    }

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create post' },
      { status: 500 }
    );
  }
}


