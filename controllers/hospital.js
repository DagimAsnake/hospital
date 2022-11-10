const Hospital = require('../models/hospital')

const owners = ["Private", "Public", "Non-Profitable Org"]

const Items_Per_Page = 7;

module.exports.index = async (req, res) => {
    const page = +req.query.page || 1
    const { owner } = req.query

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
            nohospital: null
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
            nohospital: null
        })

    }

}

module.exports.renderNewForm = (req, res) => {
    res.render('hospitals/new.ejs', { owners })
}

module.exports.createHospital = async (req, res) => {
    if (!req.body.hospital) throw new ExpressError('invalid', 404)
    const newHospital = new Hospital(req.body.hospital)
    newHospital.author = req.user._id
    await newHospital.save()
    req.flash('success', 'Successfully made a new Hospital')
    res.redirect(`/hospitals/${newHospital._id}`)
}

module.exports.showHospital = async (req, res) => {
    const { id } = req.params
    const hospital = await Hospital.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author')
    if (!hospital) {
        req.flash('error', 'cannot find hospital')
        res.redirect('/hospitals')
    }
    res.render('hospitals/show.ejs', { hospital })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params
    const hospital = await Hospital.findById(id)
    if (!hospital) {
        req.flash('error', 'cannot find hospital')
        res.redirect('/hospitals')
    }
    res.render('hospitals/edit.ejs', { hospital, owners })
}

module.exports.updateHospital = async (req, res) => {
    const { id } = req.params
    const hospital = await Hospital.findByIdAndUpdate(id, { ...req.body.hospital }, { runValidators: true, new: true })
    req.flash('success', 'Successfully updated a Hospital')
    res.redirect(`/hospitals/${hospital._id}`)
}

module.exports.deleteHospital = async (req, res) => {
    const { id } = req.params
    const deletedHospital = await Hospital.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted Hospital')
    res.redirect('/hospitals')
}