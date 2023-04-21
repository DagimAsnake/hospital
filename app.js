if (process.env.NODE_ENV != 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const Hospital = require('./models/hospital')
const methodOverride = require('method-override')
const ejsmate = require('ejs-mate')
const CatchAsync = require('./utils/CatchAsync')
const ExpressError = require('./utils/ExpressError')
const { HospitalSchema, ReviewSchema } = require('./schemas.js')
const Review = require('./models/review')
const session = require('cookie-session')
const flash = require('connect-flash')
const User = require('./models/user')
const passport = require('passport')
const passportLocal = require('passport-local')

const UserRouter = require('./routes/user')
const HospitalRouter = require('./routes/hospital')
const ReviewRouter = require('./routes/review')

// const dbUrl = 'mongodb://localhost:27017/hospital'
const dbUrl = process.env.DB_URL

const MongoStore = require('connect-mongo')

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Database is connected')
    })
    .catch((err) => {
        console.log('Database is NOT connected', err)
    })

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.engine('ejs', ejsmate)

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))


const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret: 'thisisthesecret',
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    secret: 'thisissecrete',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

passport.use(new passportLocal(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.get('/hospitals/search', async (req, res) => {
    let nohospital = null
    const { owner } = req.query
    const page = +req.query.page || 1
    const Items_Per_Page = 7;

    if (req.query.search) {
        const search = req.query.search
        const regex = new RegExp(escapeRegex(req.query.search), 'gi')
        const totalHosp = await Hospital.find({ "$or": [{ name: regex }, { category: regex }] }).countDocuments()
        const hospitals = await Hospital.find({ "$or": [{ name: regex }, { category: regex }] })
            .sort({ createdAt: -1 })
            .skip((page - 1) * Items_Per_Page)
            .limit(Items_Per_Page)
        if (hospitals.length === 0) {
            nohospital = 'No hospitals are found with that Name or Category, Please try again'
        }
        res.render('hospitals/index.ejs', {
            hospitals: hospitals,
            owner: "All",
            currentPage: page,
            hasNextPage: Items_Per_Page * page < totalHosp,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalHosp / Items_Per_Page),
            nohospital: nohospital
        })

    } else {
        if (owner) {
            const totalHosp = await Hospital.find().countDocuments()
            const hospitals = await Hospital.find({ owner })
                .sort({ createdAt: -1 })
                .skip((page - 1) * Items_Per_Page)
                .limit(Items_Per_Page)
            res.render('hospitals/index.ejs', {
                hospitals: hospitals,
                owner,
                currentPage: page,
                hasNextPage: Items_Per_Page * page < totalHosp,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalHosp / Items_Per_Page),
                nohospital: nohospital
            })

        } else {
            const totalHosp = await Hospital.find().countDocuments()
            const hospitals = await Hospital.find()
                .sort({ createdAt: -1 })
                .skip((page - 1) * Items_Per_Page)
                .limit(Items_Per_Page)
            res.render('hospitals/index.ejs', {
                hospitals: hospitals,
                owner: 'All',
                currentPage: page,
                hasNextPage: Items_Per_Page * page < totalHosp,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalHosp / Items_Per_Page),
                nohospital: nohospital
            })

        }

    }

})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

app.use('/', UserRouter)
app.use('/hospitals', HospitalRouter)
app.use('/hospitals/:id/reviews', ReviewRouter)

app.get('/', (req, res) => {
    res.render('home.ejs')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'something went wrong'
    res.status(statusCode).render('error.ejs', { err })
})

app.listen(3000, () => {
    console.log("App is listening on port 3000")
})