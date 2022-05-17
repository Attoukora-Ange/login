const mongoose = require('mongoose')
require('dotenv').config();

const db = process.env.DATA_BASE

module.exports = () => {
    mongoose.connect(db)
    mongoose.connection.once('open', () => {
        console.log('Mongoose connecté')
    }).on('error', (error) => {
        console.log('Echec de la connexion ' + error)
    })}
