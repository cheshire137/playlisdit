import React, { Component } from 'react'
import SpotifyAPI from '../models/SpotifyAPI'
import { withRouter } from 'react-router-dom'

class Header extends Component {
  signOut = () => {
    SpotifyAPI.signOut()
    this.props.history.push('/')
  }

  render() {
    return (
      <section className="hero is-link">
        <div className="hero-body">
          <div className="container d-flex flex-items-center flex-justify-between">
            <div>
              <h1 className="title">
                <a
                  href="/"
                >Playlisdit</a>
              </h1>
              <h2 className="subtitle">
                Create Spotify playlists from songs posted on Reddit.
              </h2>
            </div>
            {SpotifyAPI.isAuthenticated() ? (
              <button
                type="button"
                className="button is-link"
                onClick={this.signOut}
              >Sign out</button>
            ) : ''}
          </div>
        </div>
      </section>
    )
  }
}

export default withRouter(Header)
