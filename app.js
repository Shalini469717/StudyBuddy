// modules
const express = require('express');
const bodyParser = require('body-parser');
const http = require("https");
const _ = require('lodash');

let app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.get('/',(req,res) =>{
    res.redirect('/homepage')
})
// rendering homepage
app.get('/homepage', (req, res) => {
    res.render('homepage')
})
app.post('/homepage',(req,res) => {
    let url = req.url
    console.log(url)
    if(url == 'music')
        res.rendirect('/music')
    if(url == 'timer')
        res.redirect('/timer')
    if(url == 'doubts')
        res.redirect('/doubts')
})
app.get('/music',(req,res) => {
    let data = [];
    res.render('music',{tableHeading: "No song playing",data : data})
})
app.get('/timer',(req,res) => {
    res.render('timer')
})
app.post('/music', (request, response) => {
    console.log(request.body)
    if (request.body.search != '') {
        let song = request.body.search
        const http = require("https");

        const options = {
            "method": "GET",
            "hostname": "spotify-scraper.p.rapidapi.com",
            "port": null,
            "path": encodeURI("/v1/search?term=" + song),
            "headers": {
                "X-RapidAPI-Key": "c6508df8d2msh28c51d25a65f866p1c9b1ajsn7ff5b8b72944",
                "X-RapidAPI-Host": "spotify-scraper.p.rapidapi.com",
                "useQueryString": true
            }
        };


        const req = http.request(options, function (res) {
            const chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                const body = Buffer.concat(chunks);
                let data = JSON.parse(body)
                console.log(data.albums.items)
                tableHeading = ""
                response.render('music', {tableHeading: tableHeading,data: data.albums.items})
            });
        });

        req.end();
    }
})
app.get('/doubts', (req, res) => {
    res.render('doubts',{answer:""})
})
app.post('/doubts', (request, response) => {

    const options = {
        "method": "POST",
        "hostname": "openai80.p.rapidapi.com",
        "port": null,
        "path": "/chat/completions",
        "headers": {
            "content-type": "application/json",
            "X-RapidAPI-Key": "c6508df8d2msh28c51d25a65f866p1c9b1ajsn7ff5b8b72944",
            "X-RapidAPI-Host": "openai80.p.rapidapi.com",
            "useQueryString": true
        }
    };

    const req = http.request(options, function (res) {
        const chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            const body = Buffer.concat(chunks);
            console.log(JSON.parse(body).choices);
            // let data = JSON.parse(body)
            response.render('doubts', { answer: JSON.parse(body).choices[0].message.content})
        });
    });
    let con = (request.body.chat).toString()
    req.write(JSON.stringify({ model: 'gpt-3.5-turbo', messages: [{ role: 'user', content: con }] }));
    req.end();
   
})
app.get('/subscription',(req,res) =>{
    res.render('subscription')
})
app.listen(3000, () => { console.log("Listening at port 30000") })