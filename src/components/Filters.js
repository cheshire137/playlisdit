import React, { Component } from 'react'
import SectionMenu from './SectionMenu'
import TimeMenu from './TimeMenu'
import NumberHelper from '../models/NumberHelper'

class Filters extends Component {
  render() {
    const { activeSection, activeTime, chooseSection, chooseTime,
            trackCount } = this.props
    const trackUnit = trackCount === 1 ? 'track' : 'tracks'

    return (
      <div className="d-flex flex-items-center flex-justify-between mb-4">
        <h2 className="subtitle mb-0">
          <span>Spotify Posts on Reddit</span>
          {typeof trackCount === 'number' ? (
            <span>: {NumberHelper.format(trackCount)} {trackUnit}</span>
          ) : ''}
        </h2>
        <div>
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
