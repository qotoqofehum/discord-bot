const express = require('express');
const app = express();

app.get('/', (req, res) =>{
    res.send("<br><h1>If you are on this page, it means that the Discopen AI bot should be running!</h1>")
});


function keepAlive() {
    app.listen('1337', () => {
        console.log(`\nServer is running on port 1337 | ${Date.now()}`);
    });
} // <--- keepAlive() function ends here

module.exports = keepAlive;