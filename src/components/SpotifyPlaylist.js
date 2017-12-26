import React, { Component } from 'react'
import ExternalLink from './ExternalLink'
import SpotifyTrack from './SpotifyTrack'

class SpotifyPlaylist extends Component {
  render() {
    const { name } = this.props
    const tracks = this.props.tracks.items.map(item => item.track)

    return (
      <div className="spotify-playlist content">
        <h3 className="spotify-playlist-name subtitle mb-0 mt-2">{name}</h3>
        <ol className="spotify-playlist-tracks-list ml-0 mt-1 width-full">
          {tracks.map(track => (
            <li key={track.id}>
              <SpotifyTrack {...track} />
            </li>
          ))}
        </ol>
      </div>
    )
  }
}

export default SpotifyPlaylist
