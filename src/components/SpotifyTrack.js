import React, { Component } from 'react'
import ExternalLink from './ExternalLink'
import SpotifyArtist from './SpotifyArtist'

class SpotifyTrack extends Component {
  render() {
    const { artists, name } = this.props

    return (
      <div className="spotify-track">
        {name}
        <span> by </span>
        {artists.map(artist => (
          <SpotifyArtist {...artist} key={artist.id} />
        ))}
      </div>
    )
  }
}

export default SpotifyTrack
