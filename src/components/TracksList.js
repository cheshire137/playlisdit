import React, { Component } from 'react'
import SpotifyTrack from './SpotifyTrack'

class TracksList extends Component {
  render() {
    const { tracks, className } = this.props

    return (
      <ol className={`tracks-list ${className}`}>
        {tracks.map((track, i) => (
          <li key={`${track.id}-${i}`}>
            <SpotifyTrack {...track} />
          </li>
        ))}
      </ol>
    )
  }
}

export default TracksList
