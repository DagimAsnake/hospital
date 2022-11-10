const mongoose = require('mongoose')
const Hospital = require('../models/hospital')
const cities = require('./cities')
const { name, website, owner, category } = require('./seedHelpers')


mongoose.connect('mongodb://localhost:27017/hospital', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Database is connected')
    })
    .catch((err) => {
        console.log('Database is NOT connected', err)
    })

const samp = array => array[Math.floor(Math.random() * array.length)]


const seedDb = async () => {
    await Hospital.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const rand1000 = Math.floor(Math.random() * 30)
        const beds = Math.floor((Math.random() * 20))
        const c = new Hospital({
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            phone: `011${cities[rand1000].phone}`,
            name: `${samp(name)}`,
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officia possimus iure corporis facilis minus neque beatae! Tempora eaque ipsum temporibus, impedit ullam exercitationem quibusdam inventore ducimus laboriosam necessitatibus, quam expedita!',
            beds,
            website: `${samp(website)}`,
            owner: `${samp(owner)}`,
            category: `${samp(category)}`,
            author: '634e784e283edf909e47355c',
            image: 'https://source.unsplash.com/collection/483251'
        })
        await c.save()
    }

}

seedDb().then(() => {
    mongoose.connection.close()
})
