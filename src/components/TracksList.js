import React, { Component } from 'react'
import SpotifyTrack from './SpotifyTrack'

class TracksList extends Component {
  render() {
    const { tracks, className, trackCount } = this.props

    return (
      <div>
        <ol className={`tracks-list ${className}`}>
          {tracks.map((track, i) => (
            <li key={`${track.id}-${i}`}>
              <SpotifyTrack {...track} />
            </li>
          ))}
        </ol>
        {trackCount > tracks.length ? (
          <p>&hellip;And {trackCount - tracks.length} more</p>
        ) : ''}
      </div>
    )
  }
}

export default TracksList
