function isAdmin(req, res, next) {
  // Check if user is logged in
  if (!req.user) {
    return res.redirect("/login");
  }

  // Check if user is admin
  if (req.user.role !== "ADMIN") {
    return res.status(403).send("Access Denied: Admins only");
  }

  // If everything is fine
  next();
}

module.exports = {
    isAdmin,
}