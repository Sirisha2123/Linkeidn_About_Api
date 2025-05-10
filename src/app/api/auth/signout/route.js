import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Clear any session cookies or tokens here if needed
    const response = NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL));
    
    // Clear any auth-related cookies
    response.cookies.delete('auth_token');
    response.cookies.delete('session');
    
    return response;
  } catch (error) {
    console.error('Error during sign out:', error);
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL));
  }
} 