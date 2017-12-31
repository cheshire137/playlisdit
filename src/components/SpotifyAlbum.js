import React, { Component } from 'react'
import ExternalLink from './ExternalLink'
import SpotifyLogo from './SpotifyLogo'
import TracksList from './TracksList'
import TrackCount from './TrackCount'
import SpotifyArtist from './SpotifyArtist'

class SpotifyAlbum extends Component {
  render() {
    const { name, artists, onAudioPlay, onAudioPause, currentTrack } = this.props
    const tracks = this.props.tracks.items
    const url = this.props.external_urls.spotify
    const trackCount = this.props.tracks.total

    return (
      <div className="spotify-album content">
        <p className="spotify-album-name mb-0 mt-2">
          <ExternalLink
            url={url}
            className="spotify-link"
          >
            <SpotifyLogo className="mr-1" />
            {name}
          </ExternalLink>
          <span> by </span>
          {artists.map(artist => (
            <SpotifyArtist {...artist} key={artist.id} />
          ))}
          <TrackCount type="album" count={trackCount} />
        </p>
        <TracksList
          artistIDs={artists.map(artist => artist.id).sort()}
          tracks={tracks}
          onAudioPlay={onAudioPlay}
          onAudioPause={onAudioPause}
          currentTrack={currentTrack}
          trackCount={trackCount}
          className="spotify-album-tracks-list mt-1 width-full"
        />
      </div>
    )
  }
}

export default SpotifyAlbum
