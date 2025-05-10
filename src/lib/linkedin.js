import axios from 'axios';

const LINKEDIN_CLIENT_ID = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const LINKEDIN_REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`;

const LINKEDIN_AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization';
const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';
const LINKEDIN_PROFILE_URL = 'https://api.linkedin.com/v2/me';
const LINKEDIN_EMAIL_URL = 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))';

if (!LINKEDIN_CLIENT_ID) {
  console.error('NEXT_PUBLIC_LINKEDIN_CLIENT_ID is not defined in environment variables');
}

const linkedinApi = axios.create({
  baseURL: 'https://api.linkedin.com/v2',
  headers: {
    'Content-Type': 'application/json',
    'X-Restli-Protocol-Version': '2.0.0',
  },
});

// Add response interceptor for better error handling
linkedinApi.interceptors.response.use(
  (response) => {
    console.log('LinkedIn API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('LinkedIn API Error:', {
        url: error.config?.url,
        status: error.response.status,
        data: error.response.data,
        message: error.response.data?.message || error.message
      });
    } else {
      console.error('LinkedIn API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export function getLinkedInAuthUrl() {
  if (!LINKEDIN_CLIENT_ID) {
    throw new Error('LinkedIn Client ID is not configured');
  }

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: LINKEDIN_CLIENT_ID,
    redirect_uri: LINKEDIN_REDIRECT_URI,
    state: generateRandomString(),
    scope: 'openid profile email w_member_social',
  });

  return `${LINKEDIN_AUTH_URL}?${params.toString()}`;
}

export function getLinkedInSignOutUrl() {
  if (!LINKEDIN_CLIENT_ID) {
    throw new Error('LinkedIn Client ID is not configured');
  }
  return `https://www.linkedin.com/oauth/v2/logout?client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(LINKEDIN_REDIRECT_URI)}`;
}

export async function getLinkedInAccessToken(code) {
  if (!LINKEDIN_CLIENT_ID || !LINKEDIN_CLIENT_SECRET) {
    throw new Error('LinkedIn credentials are not configured');
  }

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: LINKEDIN_REDIRECT_URI,
    client_id: LINKEDIN_CLIENT_ID,
    client_secret: LINKEDIN_CLIENT_SECRET,
  });

  const response = await fetch(LINKEDIN_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get access token: ${error}`);
  }

  return response.json();
}

export async function getLinkedInProfile(accessToken) {
  const [profileResponse, emailResponse] = await Promise.all([
    fetch(LINKEDIN_PROFILE_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
    fetch(LINKEDIN_EMAIL_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  ]);

  if (!profileResponse.ok || !emailResponse.ok) {
    throw new Error('Failed to fetch profile data');
  }

  const profile = await profileResponse.json();
  const emailData = await emailResponse.json();

  return {
    id: profile.id,
    name: `${profile.localizedFirstName} ${profile.localizedLastName}`,
    given_name: profile.localizedFirstName,
    family_name: profile.localizedLastName,
    email: emailData.elements?.[0]?.['handle~']?.emailAddress,
    picture: profile.profilePicture?.['displayImage~']?.elements?.[0]?.identifiers?.[0]?.identifier,
    sub: profile.id,
    updatedAt: new Date().toISOString(),
  };
}

function generateRandomString() {
  const array = new Uint32Array(28);
  window.crypto.getRandomValues(array);
  return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
}

// Function to fetch profile information
export async function fetchProfileInfo(accessToken) {
  try {
    const response = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching profile info:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch profile info');
  }
} 