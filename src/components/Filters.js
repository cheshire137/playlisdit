import React, { Component } from 'react'
import RedditFilters from './RedditFilters'
import SpotifyFilters from './SpotifyFilters'

class Filters extends Component {
  render() {
    const { showSpotifyFilters } = this.props

    return (
      <div className="d-flex flex-items-center flex-justify-between mb-4">
        {showSpotifyFilters ? (
          <SpotifyFilters
            activeItemTypes={this.props.activeItemTypes}
            chooseItemTypes={this.props.chooseItemTypes}
            allowFilteringByItemType={this.props.allowFilteringByItemType}
          />
        ) : <div />}

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
    )
  }
}

export default Filters
