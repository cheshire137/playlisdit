import React, { Component } from 'react'
import ExternalLink from './ExternalLink'
import SpotifyLogo from './SpotifyLogo'
import NumberHelper from '../models/NumberHelper'

class PlaylistHeader extends Component {
  render() {
    const { trackCount, playlist, allowSave, isSaving } = this.props
    const trackUnit = trackCount === 1 ? 'track' : 'tracks'

    return (
      <div className="d-flex flex-items-center mb-4">
        <h2 className="subtitle mb-0">
          <span>Spotify Posts on Reddit</span>
          <span className="is-size-6 ml-3 text-gray">
            {typeof trackCount === 'number' ? (
              <span>{NumberHelper.format(trackCount)} {trackUnit} </span>
            ) : ''}
          </span>
        </h2>
        {playlist ? (
          <h2
            className="subtitle ml-3 mb-0"
          >
            <ExternalLink
              url={playlist.url}
              title={playlist.name}
              className="spotify-link"
            >
              <SpotifyLogo className="mr-1" />
              Created playlist!
            </ExternalLink>
          </h2>
        ) : ''}
        {isSaving ? (
          <h2
            className="subtitle ml-3 mb-0"
          >Saving...</h2>
        ) : ''}
        {allowSave ? (
          <button
            type="button"
            onClick={this.props.savePlaylist}
            className="button ml-3 is-primary"
          >Save playlist</button>
        ) : ''}
      </div>
    )
  }
}

export default PlaylistHeader
