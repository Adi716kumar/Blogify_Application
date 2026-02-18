const JWT = require('jsonwebtoken')

const secret = 'aditya786';

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
    
