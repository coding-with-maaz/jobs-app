// middlewares/authMiddleware.js

/**
 * Check if user is authenticated (session-based).
 * If not, return 401 Unauthorized.
 */
exports.requireAuth = (req, res, next) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated.' });
    }
    next();
  };
  
  /**
   * Check if user is an admin.
   * We assume `req.session.role` was set during signIn.
   */
  exports.requireAdmin = (req, res, next) => {
    if (req.session.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admins only.' });
    }
    next();
  };
  
  /**
   * Check if user is a regular "user" or higher.
   * If they must be at least user, we can just check authentication.
   * (This is optional if requireAuth() is enough for normal users.)
   */
  exports.requireUser = (req, res, next) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated.' });
    }
    // role check if you'd like to ensure the role is at least 'user'
    if (req.session.role !== 'user' && req.session.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Users only.' });
    }
    next();
  };
  