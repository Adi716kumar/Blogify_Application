const JWT = require('jsonwebtoken')

// Falls back to the old hardcoded value so existing logged-in users aren't
// signed out. Set JWT_SECRET in your environment (Render dashboard) and this
// will pick it up automatically going forward.
const secret = process.env.JWT_SECRET || 'aditya786';

function createTokenForUser(user){
    const payload = {
        id: user._id,//unique identifier for user
        email: user.email,
        name: user.fullName,
        profileImageURL: user.profileImageURL,
        role: user.role
    };
    const token = JWT.sign(payload,secret);
    return token;
}

function verifyToken(token){
    const payload = JWT.verify(token,secret);
    return payload;
}

module.exports = {
    createTokenForUser,
    verifyToken,
}
    
