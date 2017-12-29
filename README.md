# Playlisdit

Create Spotify playlists from songs posted on Reddit.

![Screenshot](https://raw.githubusercontent.com/cheshire137/playlisdit/master/screenshot.png)

## How to Develop

[Create a Spotify app](https://developer.spotify.com/my-applications).
Modify src/config.json to have your app's client ID. Add `http://localhost:3000/`
as a redirect URI to your Spotify app.

```bash
yarn install
npm start
open http://localhost:3000/
```

## How to Deploy to Heroku

```bash
heroku git:remote -a your-heroku-app
heroku buildpacks:add https://github.com/mars/create-react-app-buildpack.git
git push heroku master
```
