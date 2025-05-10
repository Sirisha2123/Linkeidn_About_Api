import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Profile } from '@/models/Profile';
import axios from 'axios';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  try {
    await connectDB();
    const profiles = await Profile.find({});
    return NextResponse.json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    await connectDB();
    
    const profile = await Profile.findOneAndUpdate(
      { sub: data.sub },
      data,
      { upsert: true, new: true }
    );
    
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error saving profile:', error);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const accessToken = searchParams.get('access_token');

    if (!accessToken) {
      return NextResponse.json({ error: 'No access token provided' }, { status: 401 });
    }

    // Fetch profile info from LinkedIn using OpenID Connect
    const userInfoResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    const profileInfo = userInfoResponse.data;

    // Connect to MongoDB
    await connectDB();

    // Validate required fields
    if (!profileInfo.sub || !profileInfo.name || !profileInfo.email) {
      throw new Error('Missing required profile information');
    }

    // Update the profile in MongoDB
    const updatedProfile = await Profile.findOneAndUpdate(
      { sub: profileInfo.sub },
      {
        $set: {
          sub: profileInfo.sub,
          name: profileInfo.name,
          given_name: profileInfo.given_name || profileInfo.name.split(' ')[0],
          family_name: profileInfo.family_name || profileInfo.name.split(' ').slice(1).join(' '),
          picture: profileInfo.picture,
          email: profileInfo.email,
          updatedAt: new Date()
        }
      },
      { 
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    console.log('Updated profile in MongoDB:', updatedProfile);

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Error in profile route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch profile' },
      { status: 500 }
    );
  }
} 