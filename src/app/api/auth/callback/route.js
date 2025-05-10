import { NextResponse } from 'next/server';
import { createProfile } from '@/models/Profile';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
      throw new Error('No authorization code received');
    }

    console.log('Received authorization code from LinkedIn');

    // Exchange code for access token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error('LinkedIn OAuth error:', error);
      throw new Error('Failed to obtain access token');
    }

    const tokenData = await tokenResponse.json();
    console.log('Successfully obtained access token');

    // Get user info from LinkedIn
    const userInfoResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      throw new Error('Failed to fetch user info');
    }

    const userInfo = await userInfoResponse.json();
    console.log('Fetched user info:', userInfo);

    // Create or update profile
    const profile = await createProfile({
      sub: userInfo.sub,
      name: userInfo.name,
      given_name: userInfo.given_name,
      family_name: userInfo.family_name,
      email: userInfo.email,
      picture: userInfo.picture,
      accessToken: tokenData.access_token,
      expiresIn: tokenData.expires_in,
    });

    // Redirect to profile page with the profile ID
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/profile?id=${profile._id}`);
  } catch (error) {
    console.error('Error in callback:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/profile?error=${encodeURIComponent(error.message)}`);
  }
} 