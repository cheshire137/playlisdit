import React, { Component } from 'react'
import ExternalLink from './ExternalLink'
import SpotifyArtist from './SpotifyArtist'

class AudioControls extends Component {
  pauseAudio = () => {
    this.props.audioTag.pause()
    this.props.onAudioPause({ manuallyPaused: true, isFinished: false })
  }

  render() {
    const { artists, name, album } = this.props
    const url = this.props.external_urls.spotify

    return (
      <div className="audio-control-bar border-top px-4 py-2">
        <span className="mr-2 d-inline-block">Currently previewing:</span>
        <button
          type="button"
          onClick={this.pauseAudio}
          className="button circle py-0 px-2 mr-2 audio-control-button is-white"
        >
          <span className="icon">
            <i className="ion-ios-pause" aria-hidden="true" />
          </span>
        </button>
        <ExternalLink
          url={url}
          className="spotify-link text-bold"
        >{name}</ExternalLink>
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
