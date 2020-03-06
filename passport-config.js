const LocalStrategy = require('passport-local').Strategy;
const bcryptjs = require('bcryptjs');

function initializar(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = getUserByEmail(email)
    if (user == null) {
      return done(null, false, { message: 'Esse e-mail não existe. Tente novamente!' })
    }

    try {
      if (await bcryptjs.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Senha incorreta. Tente novamente!' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
}

module.exports = initializar;
