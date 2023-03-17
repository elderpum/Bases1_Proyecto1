const { OAuth2Client } = require('google-auth-library');

const googleClient = process.env.GOOGLE_CLIENT_ID;

const client = new OAuth2Client(googleClient);

async function googleVerify( token = '') {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: googleClient,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const { name, picture, email } = ticket.getPayload();

    return { name, img: picture, email }
}


module.exports = {
    googleVerify
}

