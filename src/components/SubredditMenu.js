import React, { Component } from 'react'
import MultiSelectMenu from './MultiSelectMenu'
import clickOutside from 'react-click-outside'

class SubredditMenu extends MultiSelectMenu {
  getHeader() {
    const { activeItems } = this.state
    const { subreddits } = this.props
    const unit = subreddits.length === 1 ? 'subreddit' : 'subreddits'

    return `${activeItems.length} of ${subreddits.length} ${unit}`
  }

  getItems() {
    return this.props.subreddits
  }

  getItemLabel(subreddit) {
    return subreddit
  }

  handleClickOutside() {
    this.setState(prevState => ({ isOpen: false }))
    this.props.chooseItems(this.state.activeItems)
  }

  toggleOpen() {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }))
  }
}

export default clickOutside(SubredditMenu)
