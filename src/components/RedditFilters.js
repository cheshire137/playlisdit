import React, { Component } from 'react'
import TimeMenu from './TimeMenu'
import SectionMenu from './SectionMenu'
import SubredditMenu from './SubredditMenu'

class RedditFilters extends Component {
  render() {
    const { subreddits, activeSubreddits, chooseSubreddits,
            activeSection, chooseSection, activeTime,
            chooseTime } = this.props

    return (
      <div>
        {subreddits.length > 0 ? (
          <SubredditMenu
            subreddits={subreddits}
            activeItems={activeSubreddits}
            chooseItems={chooseSubreddits}
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
    )
  }
}

export default RedditFilters
