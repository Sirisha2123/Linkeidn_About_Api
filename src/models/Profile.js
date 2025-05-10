import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  sub: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  given_name: { type: String, required: true },
  family_name: { type: String, required: true },
  email: { type: String, required: true },
  picture: { type: String },
  accessToken: { type: String },
  expiresIn: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'profiles'
});

// Create the model if it doesn't exist, or use the existing one
const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);

export async function createProfile(profileData) {
  try {
    // Ensure we're connected to MongoDB
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    // Try to find existing profile
    const existingProfile = await Profile.findOne({ sub: profileData.sub });

    if (existingProfile) {
      // Update existing profile
      const updatedProfile = await Profile.findOneAndUpdate(
        { sub: profileData.sub },
        { 
          ...profileData,
          updatedAt: new Date()
        },
        { 
          new: true,
          runValidators: true
        }
      );
      console.log('Updated existing profile:', updatedProfile);
      return updatedProfile;
    } else {
      // Create new profile
      const newProfile = new Profile({
        ...profileData,
        updatedAt: new Date()
      });
      await newProfile.save();
      console.log('Created new profile:', newProfile);
      return newProfile;
    }
  } catch (error) {
    console.error('Error in createProfile:', error);
    throw new Error('Failed to create or update profile');
  }
}

export async function getProfile(sub) {
  try {
    // Ensure we're connected to MongoDB
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    return await Profile.findOne({ sub });
  } catch (error) {
    console.error('Error getting profile:', error);
    throw error;
  }
}

export async function getProfileById(id) {
  try {
    // Ensure we're connected to MongoDB
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    return await Profile.findById(id);
  } catch (error) {
    console.error('Error getting profile by ID:', error);
    throw error;
  }
}

export { Profile }; 