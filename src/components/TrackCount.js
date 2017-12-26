import React, { Component } from 'react'
import NumberHelper from '../models/NumberHelper'

class TrackCount extends Component {
  render() {
    const { count, type } = this.props

    return (
      <span className="track-count">
        {type} &middot; {NumberHelper.format(count)} track{count === 1 ? '' : 's'}
      </span>
    )
  }
}

export default TrackCount
