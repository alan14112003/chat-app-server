import { OAuth2Client } from 'google-auth-library'

const client = new OAuth2Client()

const GoogleOauth2Config = {
  verify: async (token) => {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_IDS.split(','),
    })
    const payload = ticket.getPayload()
    return payload
  },
}

export default GoogleOauth2Config
