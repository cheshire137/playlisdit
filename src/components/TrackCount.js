import React, { Component } from 'react'

class TrackCount extends Component {
  render() {
    const { count } = this.props

    return (
      <span className="track-count">
        {count} track{count === 1 ? '' : 's'}
      </span>
    )
  }
}

export default TrackCount
