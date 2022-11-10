const User = require('../models/user')

module.exports.renderRegister = (req, res) => {
    res.render('user/register')
}

module.exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const user = User({ username, email })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, (err) => {
            if (err) {
                return next()
            }
            req.flash('success', 'Successfully registered')
            res.redirect('/hospitals')
        })
    } catch (err) {
        req.flash('error', err.message)
        res.redirect('/register')
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('user/login')
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back')
    res.redirect('/hospitals')
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash('success', 'Goodbye')
        res.redirect('/hospitals')
    })
}