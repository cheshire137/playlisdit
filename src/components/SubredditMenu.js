import React, { Component } from 'react'
import clickOutside from 'react-click-outside'

class SubredditMenu extends Component {
  constructor(props) {
    super(props)
    this.state = { isOpen: false, activeSubreddits: props.activeSubreddits }
  }

  componentWillReceiveProps(props) {
    this.setState(prevState => ({ activeSubreddits: props.activeSubreddits }))
  }

  toggleSubredditSelected(subreddit) {
    let activeSubreddits = this.state.activeSubreddits.slice(0)
    const index = activeSubreddits.indexOf(subreddit)
    if (index > -1) {
      const head = activeSubreddits.slice(0, index)
      const tail = activeSubreddits.slice(index + 1, activeSubreddits.length)
      activeSubreddits = head.concat(tail)
    } else {
      activeSubreddits.push(subreddit)
    }
    this.setState(prevState => ({ activeSubreddits }))
  }

  handleClickOutside() {
    this.setState(prevState => ({ isOpen: false }))
    this.props.chooseSubreddits(this.state.activeSubreddits)
  }

  toggleOpen() {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }))
  }

  render() {
    const { isOpen, activeSubreddits } = this.state
    const { subreddits } = this.props
    const unit = subreddits.length === 1 ? 'subreddit' : 'subreddits'

    return (
      <div className={`dropdown mr-3 ${isOpen ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <button
            className="button"
            aria-haspopup="true"
            aria-controls="section-menu"
            onClick={() => this.toggleOpen()}
          >
            <span>{activeSubreddits.length} of {subreddits.length} {unit}</span>
            <span className="icon is-small">
              <i className="ion-arrow-down-b" aria-hidden="true" />
            </span>
          </button>
        </div>
        <div className="dropdown-menu" id="section-menu" role="menu">
          <div className="dropdown-content">
            {subreddits.map(subreddit => {
              const isActive = activeSubreddits.indexOf(subreddit) > -1
              const domID = `subreddit-checkbox-${subreddit}`

              return (
                <label
                  htmlFor={domID}
                  key={subreddit}
                  className={`checkbox no-wrap dropdown-item ${isActive ? 'is-active' : ''}`}
                >
                  <input
                    checked={isActive}
                    type="checkbox"
                    className="mr-2"
                    id={domID}
                    onChange={() => this.toggleSubredditSelected(subreddit)}
                  />
                  {subreddit}
                </label>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
}

export default clickOutside(SubredditMenu)
