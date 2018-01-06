import React, { Component } from 'react'
import SpotifyTrack from './SpotifyTrack'

const arrayEquals = (arr1, arr2) => {
  if (!arr1 || !arr2) {
    return false
  }
  if (arr1.length !== arr2.length) {
    return false
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false
    }
  }
  return true
}

class TracksList extends Component {
  state = { autoPlay: false, playIndex: 0 }

  componentWillReceiveProps(newProps) {
    if (newProps.manuallyPaused) {
      this.setState(prevState => ({ autoPlay: false }))
    }
  }

  previewAll = () => {
    this.setState(prevState => ({ autoPlay: true }))
  }

  onAudioPause = (opts, index) => {
    this.props.onAudioPause(opts)

    if (opts.isFinished) {
      this.setState(prevState => ({ playIndex: index + 1 }))
    } else if (opts.manuallyPaused) {
      this.setState(prevState => ({ autoPlay: false }))
    }
  }

  render() {
    const { tracks, className, trackCount, artistIDs, onAudioPlay,
            currentTrack } = this.props
    const { autoPlay, playIndex } = this.state
    const showPreviewAll = currentTrack === null

    return (
      <div>
        {showPreviewAll ? (
          <button
            type="button"
            className="button is-white"
            onClick={this.previewAll}
          >Preview all</button>
        ) : ''}

        <ol className={`tracks-list ${className}`}>
          {tracks.map((track, i) => {
            const trackArtistIDs = track.artists.map(artist => artist.id).sort()

            return (
              <li key={`${track.id}-${i}`}>
                <SpotifyTrack
                  {...track}
                  autoPlay={autoPlay && playIndex === i}
                  hideArtists={arrayEquals(artistIDs, trackArtistIDs)}
                  onAudioPlay={onAudioPlay}
                  onAudioPause={opts => this.onAudioPause(opts, i)}
                  currentTrack={currentTrack}
                />
              </li>
            )
          })}
        </ol>
        {trackCount > tracks.length ? (
          <p>&hellip;and {trackCount - tracks.length} more.</p>
        ) : ''}
      </div>
    )
  }
}

export default TracksList
