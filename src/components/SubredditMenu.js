import React, { Component } from 'react'
import MultiSelectMenu from './MultiSelectMenu'

class SubredditMenu extends Component {
  render() {
    const { subreddits, activeItems, chooseItems } = this.props
    const unit = subreddits.length === 1 ? 'subreddit' : 'subreddits'
    const header = `${activeItems.length} of ${subreddits.length} ${unit}`

    return (
      <MultiSelectMenu
        header={header}
        items={subreddits}
        getLabel={subreddit => subreddit}
        activeItems={activeItems}
        chooseItems={chooseItems}
      />
    )
  }
}

export default SubredditMenu
