let express = require('express');
const axios = require("axios");
let router = express.Router();

const clientID = 'f5185c74392785133cb9'
const clientSecret = '456aae627be61dc72fdf0adb381e6e27051218d7'
const authorize_uri = 'https://github.com/login/oauth/authorize';
const redirect_uri = 'http://localhost:2002/oauth/redirect';

router.get('/', function (req, res, next) {
    res.render('login', {clientID: clientID, authorize_uri: authorize_uri, redirect_uri: redirect_uri});
});

router.get('/oauth/redirect', async (req, res) => {
    const requestToken = req.query.code;
    console.log('authorization code:', requestToken);

    const tokenResponse = await axios({
        method: 'post',
        url: 'https://github.com/login/oauth/access_token?' +
            `client_id=${clientID}&` +
            `client_secret=${clientSecret}&` +
            `code=${requestToken}`,
        headers: {
            accept: 'application/json'
        }
    })
        .catch(err => {
            res.render('error',{error: err});
        })

    const accessToken = tokenResponse.data.access_token;
    console.log(tokenResponse.data);

    const result = await axios({
        method: 'get',
        url: `https://api.github.com/user`,
        headers: {
            accept: 'application/json',
            Authorization: `token ${accessToken}`
        }
    })
        .catch(err => {
            res.render('error',{error: err});
        })
    console.log(result.data);
    const name = result.data.name;
    res.redirect(`/welcome?name=${name}`);
})

router.get("/welcome", (req, res) => {
    res.render('welcome', {name: req.query.name});
})

module.exports = router;
