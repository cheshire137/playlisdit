import React, { Component } from 'react'
import ExternalLink from './ExternalLink'
import SpotifyTrack from './SpotifyTrack'

class SpotifyAlbum extends Component {
  render() {
    const { name } = this.props
    const tracks = this.props.tracks.items

    return (
      <div className="spotify-album content">
        <h3 className="spotify-album-name subtitle mb-0 mt-2">{name}</h3>
        <ol className="spotify-album-tracks-list mt-1 width-full">
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

export default SpotifyAlbum
