function requireAuth(req, res, next) {
  if (req.session && req.session.userId) return next();
  req.session.redirectTo = req.originalUrl;
  res.redirect('/login');
}

function requireAdmin(req, res, next) {
  if (req.session && req.session.userRole === 'admin') return next();
  res.status(403).render('404', { title: 'Access Denied — NestDubai' });
}

function redirectIfAuth(req, res, next) {
  if (req.session && req.session.userId) return res.redirect('/dashboard');
  next();
}

module.exports = { requireAuth, requireAdmin, redirectIfAuth };
