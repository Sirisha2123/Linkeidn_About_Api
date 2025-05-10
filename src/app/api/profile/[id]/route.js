import { NextResponse } from 'next/server';
import { getProfileById } from '@/models/Profile';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request, { params }) {
  try {
    const { id } = params;
    console.log('Fetching profile for ID:', id);

    const profile = await getProfileById(id);
    console.log('Found profile:', profile);

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
} 