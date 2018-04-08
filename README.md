# Ghome-server

### Features
* Takes an API call to send text for your google home to say.
* Takes an API call to wake/standby your PS4(nothing to do with google home really but I use my google home to call that API so you get it).

### Dependencies
* [google-home-notifier](https://github.com/noelportugal/google-home-notifier)(actually I basically just copied the code)
* [ps4-waker](https://github.com/dhleong/ps4-waker)
* [ngrok](https://ngrok.com/)

### Usage
* Do everything [google-home-notifier](https://github.com/noelportugal/google-home-notifier) and [ps4-waker](https://github.com/dhleong/ps4-waker) ask you to do.
* The app also depends on [ngrok](https://ngrok.com/), so make sure you sign on and get a token.
* Config ghomeSettings.js following the comments' guide.
* Run `nohup node ghomeServer.js&`, and get your url for ngrok from the log.
* Google home notifier api: `https://your.ngrok.url/google-home-notifier?text=[what+you+want+your+home+say]`
* PS4-waker api:
  * Start a game: `https://your.ngrok.url/ps4-waker?text=start+[game+name+in+your+setting]`
  * Standby ps4: `https://your.ngrok.url/ps4-waker?text=game+off`