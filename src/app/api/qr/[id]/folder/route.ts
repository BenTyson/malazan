import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { TIER_LIMITS } from '@/lib/supabase/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH /api/qr/[id]/folder - Assign or remove a folder from a QR code
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
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

    // Check QR code ownership
    const { data: existingQR } = await supabase
      .from('qr_codes')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!existingQR) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    // Parse request body
    const body = await request.json();
    const { folder_id } = body;

    // If folder_id is provided (not null), verify the folder exists and belongs to user
    if (folder_id !== null) {
      const { data: folder } = await supabase
        .from('folders')
        .select('id')
        .eq('id', folder_id)
        .eq('user_id', user.id)
        .single();

      if (!folder) {
        return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
      }
    }

    // Update the QR code's folder
    const { data: qrCode, error } = await supabase
      .from('qr_codes')
      .update({ folder_id })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating QR code folder:', error);
      return NextResponse.json({ error: 'Failed to update QR code folder' }, { status: 500 });
    }

    return NextResponse.json(qrCode);
  } catch (error) {
    console.error('Error in PATCH /api/qr/[id]/folder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
