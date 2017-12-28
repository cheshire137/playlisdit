import React, { Component } from 'react'
import SectionMenu from './SectionMenu'
import TimeMenu from './TimeMenu'
import SubredditMenu from './SubredditMenu'
import NumberHelper from '../models/NumberHelper'

class Filters extends Component {
  render() {
    const { activeSection, activeTime, chooseSection, chooseTime,
            trackCount, subreddits, activeSubreddits,
            chooseSubreddits, allowSave, isSaving } = this.props
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
          {isSaving ? (
            <h2
              className="subtitle ml-3"
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
