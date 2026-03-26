const User = require('../models/User');

const authController = {
  showLogin(req, res) {
    if (req.session.userId) return res.redirect('/dashboard');
    res.render('login', { title: 'Sign In — NestDubai', error: null, formData: {} });
  },

  showRegister(req, res) {
    if (req.session.userId) return res.redirect('/dashboard');
    res.render('register', { title: 'Create Account — NestDubai', error: null, formData: {} });
  },

  async login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.render('login', { title: 'Sign In — NestDubai', error: 'Please enter your email and password.', formData: { email } });
    }

    const user = User.findByEmail(email.toLowerCase().trim());
    if (!user || !User.verifyPassword(password, user.password_hash)) {
      return res.render('login', { title: 'Sign In — NestDubai', error: 'Incorrect email or password. Please try again.', formData: { email } });
    }

    req.session.userId = user.id;
    req.session.userName = user.name;
    req.session.userRole = user.role;

    const isAdmin = user.role === 'admin';
    const redirectTo = isAdmin ? '/admin' : (req.session.redirectTo || '/dashboard');
    if (!isAdmin) delete req.session.redirectTo;

    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.render('login', { title: 'Sign In — NestDubai', error: 'Session error. Please try again.', formData: { email } });
      }
      res.redirect(redirectTo);
    });
  },

  async register(req, res) {
    const { name, email, password, confirm_password, phone, nationality, university, student_id } = req.body;
    const formData = { name, email, phone, nationality, university, student_id };

    if (!name || !email || !password) {
      return res.render('register', { title: 'Create Account — NestDubai', error: 'Name, email and password are required.', formData });
    }
    if (password !== confirm_password) {
      return res.render('register', { title: 'Create Account — NestDubai', error: 'Passwords do not match.', formData });
    }
    if (password.length < 8) {
      return res.render('register', { title: 'Create Account — NestDubai', error: 'Password must be at least 8 characters.', formData });
    }

    const existing = User.findByEmail(email.toLowerCase().trim());
    if (existing) {
      return res.render('register', { title: 'Create Account — NestDubai', error: 'An account with this email already exists.', formData });
    }

    try {
      const userId = User.create({ name: name.trim(), email: email.toLowerCase().trim(), password, phone, nationality, university, student_id });
      const user = User.findById(userId);
      req.session.userId = user.id;
      req.session.userName = user.name;
      req.session.userRole = user.role;
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          return res.render('register', { title: 'Create Account — NestDubai', error: 'Session error. Please try again.', formData });
        }
        res.redirect('/dashboard?welcome=1');
      });
    } catch (err) {
      console.error(err);
      res.render('register', { title: 'Create Account — NestDubai', error: 'Something went wrong. Please try again.', formData });
    }
  },

  logout(req, res) {
    req.session.destroy(() => res.redirect('/'));
  }
};

module.exports = authController;
