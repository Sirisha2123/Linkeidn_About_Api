'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
        if (data.isAuthenticated && data.profile) {
          setProfile(data.profile);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 sm:text-5xl md:text-6xl">
            LinkedIn Integration
          </h1>
          <p className="mt-4 text-xl text-gray-300">
            Connect your professional network with modern tech
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-700">
          <div className="px-6 py-8">
            {isAuthenticated ? (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  {profile?.picture && (
                    <img
                      src={profile.picture}
                      alt={profile.name}
                      className="h-16 w-16 rounded-full border-2 border-blue-500"
                    />
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Welcome back, {profile?.name || 'User'}
                    </h2>
                    <p className="text-gray-400">{profile?.email}</p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Link
                    href={`/profile?id=${profile?._id}`}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    View Profile
                  </Link>
                  <Link
                    href="/api/auth/signout"
                    className="inline-flex items-center px-6 py-3 border border-gray-600 text-base font-medium rounded-lg text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                  >
                    Sign Out
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6 text-center">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white">
                    Get Started with LinkedIn Integration
                  </h2>
                  <p className="text-gray-400">
                    Connect your LinkedIn account to access your professional network
                  </p>
                </div>
                <Link
                  href="/api/auth/signin"
                  className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Sign in with LinkedIn
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 