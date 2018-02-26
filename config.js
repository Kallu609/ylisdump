const path = require('path');

const config = {
    username: '',
    password: '',

    // Lanka mihin postataan
    thread: 'https://ylilauta.org/satunnainen/77386662',

    // Kansio mistä dumpataan (__dirname = kansio missä app.js on)
    dir: path.join(__dirname, 'dumpthese'),

    // Sallitut tiedostotyypit
    types: ["mp4", "jpg", "png"],

    // Viestien välinen aika
    delay: 15000
}

module.exports = config;
