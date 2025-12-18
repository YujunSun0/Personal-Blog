import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateTag, deleteTag } from '@/lib/supabase/tags';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Tag name is required' }, { status: 400 });
    }

    const tag = await updateTag(id, name);
    return NextResponse.json(tag);
  } catch (error) {
    console.error('Error updating tag:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update tag' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await deleteTag(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete tag' },
      { status: 500 }
    );
  }
}

