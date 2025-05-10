import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`;
    const scope = 'openid profile email w_member_social';
    const state = Math.random().toString(36).substring(7);
    
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}`;
    
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Error in signin:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/profile?error=${encodeURIComponent(error.message)}`);
  }
} 