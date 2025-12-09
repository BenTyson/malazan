import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import crypto from 'crypto';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const supabase = await createClient();

  // Find the QR code by short_code
  const { data: qrCode, error } = await supabase
    .from('qr_codes')
    .select('*')
    .eq('short_code', code)
    .single();

  if (error || !qrCode) {
    // Redirect to home page if QR code not found
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Get destination URL
  let destinationUrl = qrCode.destination_url;

  // If no destination URL, construct from content
  if (!destinationUrl && qrCode.content) {
    const content = qrCode.content as Record<string, any>;
    if (content.type === 'url' && content.url) {
      destinationUrl = content.url;
    }
  }

  if (!destinationUrl) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Record the scan (async, don't wait)
  recordScan(supabase, qrCode.id, request);

  // Redirect to destination
  return NextResponse.redirect(destinationUrl);
}

async function recordScan(
  supabase: any,
  qrCodeId: string,
  request: Request
) {
  try {
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] ||
               headersList.get('x-real-ip') ||
               'unknown';
    const userAgent = headersList.get('user-agent') || '';
    const referrer = headersList.get('referer') || '';

    // Hash IP for privacy
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex').slice(0, 16);

    // Parse user agent (basic)
    const deviceType = getDeviceType(userAgent);
    const os = getOS(userAgent);
    const browser = getBrowser(userAgent);

    // Insert scan record
    await supabase.from('scans').insert({
      qr_code_id: qrCodeId,
      ip_hash: ipHash,
      device_type: deviceType,
      os: os,
      browser: browser,
      referrer: referrer,
      // Note: For geo data, you'd need to integrate an IP geolocation service
      // like MaxMind, IP-API, or similar
    });
  } catch (error) {
    console.error('Failed to record scan:', error);
  }
}

function getDeviceType(userAgent: string): string {
  if (/mobile/i.test(userAgent)) return 'mobile';
  if (/tablet|ipad/i.test(userAgent)) return 'tablet';
  return 'desktop';
}

function getOS(userAgent: string): string {
  if (/windows/i.test(userAgent)) return 'Windows';
  if (/macintosh|mac os/i.test(userAgent)) return 'macOS';
  if (/linux/i.test(userAgent)) return 'Linux';
  if (/android/i.test(userAgent)) return 'Android';
  if (/iphone|ipad|ipod/i.test(userAgent)) return 'iOS';
  return 'Unknown';
}

function getBrowser(userAgent: string): string {
  if (/chrome/i.test(userAgent) && !/edge|edg/i.test(userAgent)) return 'Chrome';
  if (/firefox/i.test(userAgent)) return 'Firefox';
  if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) return 'Safari';
  if (/edge|edg/i.test(userAgent)) return 'Edge';
  return 'Unknown';
}
