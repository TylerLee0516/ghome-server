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
      if (text.startsWith('http')){
        var mp3_url = text;
        googlehome.play(mp3_url, function(notifyRes) {
          console.log(notifyRes);
          res.send(deviceName + ' will play sound from url: ' + mp3_url + '\n');
        });
      } else {
        googlehome.notify(text, function(notifyRes) {
          console.log(notifyRes);
          res.send(deviceName + ' will say: ' + text + '\n');
        });
      }
    } catch(err) {
      console.log(err);
      res.sendStatus(500);
      res.send(err);
    }
  }else{
    res.send('Please GET "text=Hello Google Home"');
  }
})

app.post('/ps4-waker', urlencodedParser, function (req, res) {

  if (!req.body) return res.sendStatus(400)
  console.log(req.body);

  var text = req.body.text;

  if (text){
    try {
      if (text.startsWith('start')) {
        var gameName = text.slice(6);
        if (gameName in settings.games) {
          res.send(gameName + ' will be started');
          var exec = require('child_process').exec;
          exec('sudo ps4-waker start ' + settings.games[gameName], function(err, stdout, stderr){
            console.log(stdout);
          });
        } else {
          res.send('You need to buy ' + gameName + ' first!');
        }
      } else if (text === 'game off') {
        var exec = require('child_process').exec;
        exec('sudo ps4-waker standby', function(err, stdout, stderr){
          res.send('Your ps4 will go to sleep');
          console.log(stdout);
        });
      } else {
        res.sendStatus(400);
      }
    } catch(err) {
      console.log(err);
      res.sendStatus(500);
      res.send(err);
    }
  }else{
    res.send('Please POST "text=start monster hunter"');
  }
})

app.listen(serverPort, function () {
  ngrok.connect(serverPort, function (err, url) {
    console.log('Endpoints:');
    console.log('  google home notifier: ' + url + '/google-home-notifier');
    console.log('  ps4 waker: ' + url + '/ps4-waker');
    console.log('POST example:');
    console.log('curl -X POST -d "text=Hello Google Home" ' + url + '/google-home-notifier');
  });
})
