import React, { Component } from 'react'
import Header from './Header'
import SpotifyLogo from './SpotifyLogo'
import Config from '../config.json'
import SpotifyAPI from '../models/SpotifyAPI'
import { Redirect } from 'react-router-dom'

class SpotifyLogin extends Component {
  componentDidMount() {
    const hash = this.props.location.hash
    if (hash && hash.indexOf('access_token') > -1) {
      const parts = hash.split('access_token=')
      const token = parts[parts.length - 1].split('&')[0]
      SpotifyAPI.authenticate(token)
      this.props.history.push('/playlist')
    }
  }

  render() {
    if (SpotifyAPI.isAuthenticated()) {
      return (
        <Redirect to={{
          pathname: '/playlist',
          state: { from: this.props.location }
        }} />
      )
    }

    const redirectURI = window.location.href
    const scopes = 'playlist-modify-public user-read-private'
    const loginUrl = `https://accounts.spotify.com/authorize?` +
      `client_id=${encodeURIComponent(Config.spotify.clientID)}` +
      `&response_type=token&redirect_uri=${encodeURIComponent(redirectURI)}` +
      `&scope=${encodeURIComponent(scopes)}`

    return (
      <div>
        <Header />
        <section className="section">
          <div className="container has-text-centered">
            <h3 className="subtitle mt-0">
              Sign into Spotify to create playlists from
              music shared on Reddit.
            </h3>
            <a
              href={loginUrl}
              className="button is-large is-primary"
            >
              <SpotifyLogo className="mr-1" />
              Log in with Spotify
            </a>
          </div>
        </section>
      </div>
    )
  }
}

export default SpotifyLogin
