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
  render() {
    const { tracks, className, trackCount, artistIDs } = this.props

    return (
      <div>
        <ol className={`tracks-list ${className}`}>
          {tracks.map((track, i) => {
            const trackArtistIDs = track.artists.map(artist => artist.id).sort()

            return (
              <li key={`${track.id}-${i}`}>
                <SpotifyTrack
                  {...track}
                  hideArtists={arrayEquals(artistIDs, trackArtistIDs)}
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
