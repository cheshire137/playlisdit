import React, { Component } from 'react'
import SpotifyAPI from '../models/SpotifyAPI'
import { withRouter } from 'react-router-dom'

class Header extends Component {
  state = { spotifyProfile: null }

  signOut = () => {
    SpotifyAPI.signOut()
    this.props.history.push('/')
  }

  componentDidMount() {
    if (SpotifyAPI.isAuthenticated()) {
      this.fetchSpotifyProfile()
    }
  }

  async fetchSpotifyProfile() {
    const api = new SpotifyAPI()
    const spotifyProfile = await api.me()
    this.setState(prevState => ({ spotifyProfile }))
  }

  render() {
    const { spotifyProfile } = this.state

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
                title={spotifyProfile ? spotifyProfile.id : null}
              >
                {spotifyProfile ? (
                  <span className="d-flex flex-items-center">
                    <img
                      width="25"
                      height="25"
                      src={spotifyProfile.imageUrl}
                      alt={spotifyProfile.id}
                      className="d-block mr-2 rounded-2 spotify-profile-image"
                    />
                    Sign out
                  </span>
                ) : 'Sign out'}
              </button>
            ) : ''}
          </div>
        </div>
      </section>
    )
  }
}

export default withRouter(Header)
