#!/usr/bin/env node

var express = require('express');
var googlehome = require('google-home-notifier');
var ngrok = require('ngrok');
var bodyParser = require('body-parser');
var settings = require('./ghomeSettings.js');
var app = express();
const serverPort = settings.serverPort; // default port


var deviceName = settings.ghomeName;
var ip = settings.ghomeIp; // default IP
ngrok.authtoken(settings.ngrokToken);

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/google-home-notifier', urlencodedParser, function (req, res) {

  if (!req.body) return res.sendStatus(400)
  console.log(req.body);

  var text = req.body.text;

  var language = 'us'; // default language code
  if (req.query.language) {
    language;
  }

  googlehome.ip(ip, language);

  if (text){
    try {
      googlehome.notify(text, function(notifyRes) {
        console.log(notifyRes);
        res.send(deviceName + ' will say: ' + text + '\n');
      });
    } catch(err) {
      console.log(err);
      res.sendStatus(500);
      res.send(err);
    }
  }else{
    res.send('Please GET "text=Hello Google Home"');
  }
})

app.listen(serverPort, function () {
  ngrok.connect(serverPort, function (err, url) {
    console.log('Endpoints:');
    console.log('  google home notifier: ' + url + '/google-home-notifier');
    console.log('POST example:');
    console.log('curl -X POST -d "text=Hello Google Home" ' + url + '/google-home-notifier');
  });
})
