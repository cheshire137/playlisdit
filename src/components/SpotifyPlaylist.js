import React, { Component } from 'react'
import ExternalLink from './ExternalLink'
import SpotifyLogo from './SpotifyLogo'
import TracksList from './TracksList'
import TrackCount from './TrackCount'

class SpotifyPlaylist extends Component {
  render() {
    const { name, onAudioPlay, onAudioPause, currentTrack, isFinished,
            manuallyPaused } = this.props
    const tracks = this.props.tracks.items.map(item => item.track)
    const url = this.props.external_urls.spotify
    const trackCount = this.props.tracks.total

    return (
      <div className="spotify-playlist content">
        <p className="spotify-playlist-name mb-0 mt-2">
          <ExternalLink
            url={url}
            className="spotify-link"
          >
            <SpotifyLogo className="mr-1" />
            {name}
            <TrackCount type="playlist" count={trackCount} />
          </ExternalLink>
        </p>
        <TracksList
          tracks={tracks}
          onAudioPlay={onAudioPlay}
          onAudioPause={onAudioPause}
          currentTrack={currentTrack}
          trackCount={trackCount}
          isFinished={isFinished}
          manuallyPaused={manuallyPaused}
          className="spotify-playlist-tracks-list mt-1 width-full"
        />
      </div>
    )
  }
}

export default SpotifyPlaylist
