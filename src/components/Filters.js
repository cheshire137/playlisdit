import React, { Component } from 'react'
import SectionMenu from './SectionMenu'
import TimeMenu from './TimeMenu'
import SubredditMenu from './SubredditMenu'
import NumberHelper from '../models/NumberHelper'

class Filters extends Component {
  render() {
    const { activeSection, activeTime, chooseSection, chooseTime,
            trackCount, subreddits, activeSubreddits,
            chooseSubreddits } = this.props
    const trackUnit = trackCount === 1 ? 'track' : 'tracks'
    const subredditCount = activeSubreddits.length
    const subredditUnit = subredditCount === 1 ? 'subreddit' : 'subreddits'

    return (
      <div className="d-flex flex-items-center flex-justify-between mb-4">
        <h2 className="subtitle mb-0">
          <span>Spotify Posts on Reddit </span>
          <span className="is-size-6 text-gray">
            {typeof trackCount === 'number' ? (
              <span>{NumberHelper.format(trackCount)} {trackUnit} </span>
            ) : ''}
            <span>from {NumberHelper.format(subredditCount)} {subredditUnit}</span>
          </span>
        </h2>
        <div>
          {subreddits.length > 0 ? (
            <SubredditMenu
              subreddits={subreddits}
              activeSubreddits={activeSubreddits}
              chooseSubreddits={chooseSubreddits}
            />
          ) : ''}
          <SectionMenu
            activeSection={activeSection}
            chooseSection={chooseSection}
          />
          {activeSection === 'top' ? (
            <TimeMenu
              activeTime={activeTime}
              chooseTime={chooseTime}
            />
          ) : ''}
        </div>
      </div>
    )
  }
}

export default Filters
