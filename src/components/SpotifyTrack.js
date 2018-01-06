import React, { Component } from 'react'
import ExternalLink from './ExternalLink'
import SpotifyArtist from './SpotifyArtist'
import SpotifyLogo from './SpotifyLogo'

class SpotifyTrack extends Component {
  state = { includeAudioTag: false, isPlaying: false, progress: 50 }

  componentWillReceiveProps(newProps) {
    if (newProps.currentTrack === null) {
      this.setState(prevState => ({ isPlaying: false }))
    }
  }

  onAudioEnded = () => {
    this.props.onAudioPause()
    this.setState(prevState => ({ isPlaying: false }))
  }

  onTimeUpdate = () => {
    const { currentTime, duration } = this.audioTag
    const progress = Math.round(currentTime / duration * 100)
    // this.setState(prevState => ({ progress }))
  }

  notifyAboutCurrentTrack() {
    const audioControlInfo = Object.assign({}, this.props, {
      audioTag: this.audioTag
    })
    this.props.onAudioPlay(audioControlInfo)
  }

  playAudio = () => {
    if (this.state.includeAudioTag) {
      this.audioTag.play()
      this.notifyAboutCurrentTrack()
      this.setState(prevState => ({ isPlaying: true }))
    } else {
      this.setState(prevState => ({ includeAudioTag: true, isPlaying: true }), () => {
        this.notifyAboutCurrentTrack()
      })
    }
  }

  pauseAudio = () => {
    this.props.onAudioPause()
    this.audioTag.pause()
    this.setState(prevState => ({ isPlaying: false }))
  }

  render() {
    const { artists, name, className, hideArtists, currentTrack, type, id } = this.props
    const { includeAudioTag, isPlaying, progress } = this.state
    const url = this.props.external_urls.spotify
    const audioUrl = this.props.preview_url
    const hasAudioUrl = typeof audioUrl === 'string'
    const isCurrentlyPlaying = currentTrack && currentTrack.type === type && currentTrack.id === id
    const showPlayButton = (currentTrack === null || isCurrentlyPlaying) && hasAudioUrl && !isPlaying
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
            onTimeUpdate={this.onTimeUpdate}
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
