import { OAuth2Client } from 'google-auth-library';

export const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function verifyGoogleToken(googleToken: string) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    return payload; // Contains user details from Google (e.g., email, given_name, family_name, etc.)
  } catch (error) {
    console.error('Error verifying Google token:', error);
    throw error;
  }
}
