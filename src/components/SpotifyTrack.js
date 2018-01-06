import React, { Component } from 'react'
import ExternalLink from './ExternalLink'
import SpotifyArtist from './SpotifyArtist'
import SpotifyLogo from './SpotifyLogo'

class SpotifyTrack extends Component {
  constructor(props) {
    super(props)
    this.state = {
      includeAudioTag: props.autoPlay
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.autoPlay) {
      this.setState(prevState => ({ includeAudioTag: true }), () => {
        if (this.audioTag) {
          this.audioTag.play()
        }
      })
    } else if (newProps.currentTrack === null) {
      this.setState(prevState => ({ includeAudioTag: false }))
    }
  }

  onAudioPlaying = () => {
    const audioControlInfo = Object.assign({}, this.props, { audioTag: this.audioTag })
    this.props.onAudioPlay(audioControlInfo)
  }

  onAudioEnded = () => {
    this.props.onAudioPause({ isFinished: true, manuallyPaused: false })
  }

  playAudio = () => {
    if (this.state.includeAudioTag) {
      this.audioTag.play()
    } else {
      this.setState(prevState => ({ includeAudioTag: true }))
    }
  }

  pauseAudio = () => {
    this.props.onAudioPause({ isFinished: false, manuallyPaused: true })
    this.audioTag.pause()
  }

  render() {
    const { artists, name, className, hideArtists, currentTrack, type, id } = this.props
    const { includeAudioTag } = this.state
    const url = this.props.external_urls.spotify
    const audioUrl = this.props.preview_url
    const hasAudioUrl = typeof audioUrl === 'string'
    const isCurrentlyPlaying = currentTrack && currentTrack.type === type && currentTrack.id === id
    const showPlayButton = hasAudioUrl && !isCurrentlyPlaying
    const showPauseButton = hasAudioUrl && !showPlayButton

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
            onPlay={this.onAudioPlaying}
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
