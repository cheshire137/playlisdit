import React, { Component } from 'react'
import ExternalLink from './ExternalLink'
import RedditFilters from './RedditFilters'
import SpotifyFilters from './SpotifyFilters'
import SpotifyLogo from './SpotifyLogo'
import NumberHelper from '../models/NumberHelper'

class Filters extends Component {
  render() {
    const { trackCount, playlist, allowSave, isSaving } = this.props
    const trackUnit = trackCount === 1 ? 'track' : 'tracks'

    return (
      <div className="d-flex flex-items-center flex-justify-between mb-4">
        <div className="d-flex flex-items-center">
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
        <div className="d-flex flex-items-center">
          <span
            className="mr-3"
          >Filters:</span>

          <SpotifyFilters
            activeItemTypes={this.props.activeItemTypes}
            chooseItemTypes={this.props.chooseItemTypes}
            allowFilteringByItemType={this.props.allowFilteringByItemType}
          />

          <RedditFilters
            subreddits={this.props.subreddits}
            activeSubreddits={this.props.activeSubreddits}
            activeSection={this.props.activeSection}
            activeTime={this.props.activeTime}
            chooseSubreddits={this.props.chooseSubreddits}
            chooseSection={this.props.chooseSection}
            chooseTime={this.props.chooseTime}
          />
        </div>
      </div>
    )
  }
}

export default Filters
