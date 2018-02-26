const path = require('path');

const config = {
    username: '',
    password: '',

    // Lanka mihin postataan
    thread: 'https://ylilauta.org/satunnainen/xxxxxxxx',

    // Kansio mistä dumpataan (__dirname = kansio missä app.js on)
    dir: path.join(__dirname, 'dumpthese'),
    // Tai sit vaa näin
    // dir: 'C:\\Joku\\Vitun\\sick\\kansio\\',

    // Sallitut tiedostotyypit
    types: ["mp4", "jpg", "png"],

    // Viestien välinen aika
    delay: 15000
}

module.exports = config;
