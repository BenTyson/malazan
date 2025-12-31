import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { TIER_LIMITS } from '@/lib/supabase/types';

// GET /api/folders - List user's folders
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: folders, error } = await supabase
      .from('folders')
      .select('*')
      .eq('user_id', user.id)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching folders:', error);
      return NextResponse.json({ error: 'Failed to fetch folders' }, { status: 500 });
    }

    return NextResponse.json(folders);
  } catch (error) {
    console.error('Error in GET /api/folders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/folders - Create a new folder
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's subscription tier
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

    const tier = (profile?.subscription_tier || 'free') as 'free' | 'pro' | 'business';

    // Check if user can use folders
    const folderLimit = TIER_LIMITS[tier].folders;
    if (folderLimit === 0) {
      return NextResponse.json(
        { error: 'Folders require a Pro or Business subscription' },
        { status: 403 }
      );
    }

    // Check folder count limit
    const { count } = await supabase
      .from('folders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (typeof folderLimit === 'number' && (count || 0) >= folderLimit) {
      return NextResponse.json(
        { error: `You've reached your folder limit (${folderLimit}). Upgrade to Business for unlimited folders.` },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, color } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
    }

    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      return NextResponse.json({ error: 'Folder name cannot be empty' }, { status: 400 });
    }

    if (trimmedName.length > 50) {
      return NextResponse.json({ error: 'Folder name must be 50 characters or less' }, { status: 400 });
    }

    // Create the folder
    const { data: folder, error } = await supabase
      .from('folders')
      .insert({
        user_id: user.id,
        name: trimmedName,
        color: color || '#14b8a6',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating folder:', error);
      return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 });
    }

    return NextResponse.json(folder, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/folders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
