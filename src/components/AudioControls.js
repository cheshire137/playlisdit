import React, { Component } from 'react'
import ExternalLink from './ExternalLink'
import SpotifyArtist from './SpotifyArtist'
import SpotifyLogo from './SpotifyLogo'

class AudioControls extends Component {
  render() {
    const { artists, name, album } = this.props
    const url = this.props.external_urls.spotify

    return (
      <div className="audio-control-bar border-top px-4 py-2">
        <span className="mr-2 d-inline-block">Currently previewing:</span>
        <ExternalLink
          url={url}
          className="spotify-link text-bold"
        >
          <SpotifyLogo className="mr-1" />
          {name}
        </ExternalLink>
        <span className="track-meta">
          <span> by </span>
          {artists.map(artist => (
            <SpotifyArtist {...artist} key={artist.id} />
          ))}
          {album ? (
            <span>
              <span> on </span>
              &ldquo;<ExternalLink
                url={album.external_urls.spotify}
              >{album.name}</ExternalLink>&rdquo;
            </span>
          ) : ''}
        </span>
      </div>
    )
  }
}

export default AudioControls
