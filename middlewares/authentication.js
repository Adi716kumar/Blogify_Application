const { verifyToken } = require("../services/auth");

function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        if (!tokenCookieValue) {
            return next(); // No token, proceed to the next middleware
        }

        try {
            const userPayload = verifyToken(tokenCookieValue);
            req.user = userPayload; // Set user if token is valid
        } catch (error) {
            // Optionally handle the error (e.g., log it)
            console.error("Token verification failed:", error);
            // You might want to redirect or send an error response here
        }

        next(); // Always call next() at the end
    };
}

module.exports = {
    checkForAuthenticationCookie,
}