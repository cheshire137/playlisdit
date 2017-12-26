import React, { Component } from 'react'
import ExternalLink from './ExternalLink'
import SpotifyLogo from './SpotifyLogo'
import TracksList from './TracksList'

class SpotifyPlaylist extends Component {
  render() {
    const { name } = this.props
    const tracks = this.props.tracks.items.map(item => item.track)
    const url = this.props.external_urls.spotify

    return (
      <div className="spotify-playlist content">
        <h3 className="spotify-playlist-name subtitle mb-0 mt-2">
          <ExternalLink
            url={url}
            className="spotify-link"
          >
            <SpotifyLogo className="mr-1" />
            {name}
          </ExternalLink>
        </h3>
        <TracksList
          tracks={tracks}
          className="spotify-playlist-tracks-list mt-1 width-full"
        />
      </div>
    )
  }
}

export default SpotifyPlaylist
