'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profile/${id}`);
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full"
        />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold text-white mb-4">Profile Not Found</h1>
          <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors duration-300">
            Return to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-700"
        >
          {/* Profile Header */}
          <div className="relative h-48 bg-gradient-to-r from-blue-600 to-blue-800">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="absolute -bottom-16 left-8"
            >
              <img
                src={profile.picture}
                alt={profile.name}
                className="h-32 w-32 rounded-full border-4 border-gray-800 shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </motion.div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 pb-8 px-8">
            <div className="flex justify-between items-start mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h1 className="text-3xl font-bold text-white mb-2 hover:text-blue-400 transition-colors duration-300">
                  {profile.name}
                </h1>
                <p className="text-gray-400 hover:text-gray-300 transition-colors duration-300">
                  {profile.email}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link
                  href="/api/auth/signout"
                  className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-lg text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 hover:scale-105"
                >
                  Sign Out
                </Link>
              </motion.div>
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="space-y-6"
              >
                <div className="bg-gray-700/50 rounded-xl p-6 hover:bg-gray-700/70 transition-colors duration-300">
                  <h2 className="text-xl font-semibold text-white mb-4 hover:text-blue-400 transition-colors duration-300">
                    Personal Information
                  </h2>
                  <div className="space-y-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-sm text-gray-400">Given Name</p>
                      <p className="text-white font-medium">{profile.given_name}</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-sm text-gray-400">Family Name</p>
                      <p className="text-white font-medium">{profile.family_name}</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="text-white font-medium">{profile.email}</p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="space-y-6"
              >
                <div className="bg-gray-700/50 rounded-xl p-6 hover:bg-gray-700/70 transition-colors duration-300">
                  <h2 className="text-xl font-semibold text-white mb-4 hover:text-blue-400 transition-colors duration-300">
                    Account Details
                  </h2>
                  <div className="space-y-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-sm text-gray-400">LinkedIn ID</p>
                      <p className="text-white font-medium">{profile.sub}</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-sm text-gray-400">Member Since</p>
                      <p className="text-white font-medium">
                        {new Date(profile.createdAt).toLocaleDateString()}
                      </p>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-sm text-gray-400">Last Updated</p>
                      <p className="text-white font-medium">
                        {new Date(profile.updatedAt).toLocaleDateString()}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 