import React, { Component } from 'react'
import SpotifyLogo from './SpotifyLogo'
import ExternalLink from './ExternalLink'
import TracksList from './TracksList'

class SpotifyArtistAndTracks extends Component {
  render() {
    const { name, tracks, id, onAudioPlay, onAudioPause, canPlay } = this.props
    const url = this.props.external_urls.spotify

    return (
      <div className="spotify-artist content">
        <p className="spotify-artist-name mb-0 mt-2">
          <ExternalLink
            url={url}
            className="spotify-link"
          >
            <SpotifyLogo className="mr-1" />
            {name}
          </ExternalLink>
        </p>
        <TracksList
          artistIDs={[id]}
          tracks={tracks}
          onAudioPlay={onAudioPlay}
          onAudioPause={onAudioPause}
          canPlay={canPlay}
          trackCount={tracks.length}
          className="spotify-artist-tracks-list mt-1 width-full"
        />
      </div>
    )
  }
}

export default SpotifyArtistAndTracks
