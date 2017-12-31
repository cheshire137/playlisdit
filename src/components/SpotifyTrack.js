import React, { Component } from 'react'
import ExternalLink from './ExternalLink'
import SpotifyArtist from './SpotifyArtist'
import SpotifyLogo from './SpotifyLogo'

class SpotifyTrack extends Component {
  state = { includeAudioTag: false, isPlaying: false }

  onAudioEnded = () => {
    this.props.onAudioPause()
    this.setState(prevState => ({ isPlaying: false }))
  }

  playAudio = () => {
    this.props.onAudioPlay(this.props)
    if (this.state.includeAudioTag) {
      this.audioTag.play()
      this.setState(prevState => ({ isPlaying: true }))
    } else {
      this.setState(prevState => ({ includeAudioTag: true, isPlaying: true }))
    }
  }

  pauseAudio = () => {
    this.props.onAudioPause()
    this.audioTag.pause()
    this.setState(prevState => ({ isPlaying: false }))
  }

  render() {
    const { artists, name, className, hideArtists, canPlay } = this.props
    const { includeAudioTag, isPlaying } = this.state
    const url = this.props.external_urls.spotify
    const audioUrl = this.props.preview_url
    const hasAudioUrl = typeof audioUrl === 'string'
    const showPlayButton = canPlay && hasAudioUrl && !isPlaying
    const showPauseButton = isPlaying

    return (
      <div className="spotify-track">
        {showPlayButton ? (
          <button
            type="button"
            onClick={this.playAudio}
            className="button circle py-0 px-2 mr-2 audio-control-button is-white"
          >
            <span className="icon">
              <i className="ion-ios-play" aria-hidden="true" />
            </span>
          </button>
        ) : showPauseButton ? (
          <button
            type="button"
            onClick={this.pauseAudio}
            className="button circle py-0 px-2 mr-2 audio-control-button is-white"
          >
            <span className="icon">
              <i className="ion-ios-pause" aria-hidden="true" />
            </span>
          </button>
        ) : hasAudioUrl ? (
          <span className="audio-control-filler mr-2 d-inline-block" />
        ) : ''}
        {includeAudioTag ? (
          <audio
            autoPlay
            preload="metadata"
            onEnded={this.onAudioEnded}
            src={audioUrl}
            ref={audioTag => this.audioTag = audioTag}
          />
        ) : ''}
        <ExternalLink
          url={url}
          className={className}
        >
          <SpotifyLogo className="mr-1" />
          {name}
        </ExternalLink>
        {hideArtists ? '' : (
          <span>
            <span> by </span>
            {artists.map(artist => (
              <SpotifyArtist {...artist} key={artist.id} />
            ))}
          </span>
        )}
      </div>
    )
  }
}

export default SpotifyTrack
