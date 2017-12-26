import React, { Component } from 'react'
import ExternalLink from './ExternalLink'
import SpotifyArtist from './SpotifyArtist'
import SpotifyLogo from './SpotifyLogo'

class SpotifyTrack extends Component {
  render() {
    const { artists, name, className } = this.props
    const url = this.props.external_urls.spotify

    return (
      <div className="spotify-track">
        <ExternalLink
          url={url}
          className={className}
        >
          <SpotifyLogo className="mr-1" />
          {name}
        </ExternalLink>
        <span> by </span>
        {artists.map(artist => (
          <SpotifyArtist {...artist} key={artist.id} />
        ))}
      </div>
    )
  }
}

export default SpotifyTrack
