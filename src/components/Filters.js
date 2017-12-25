import React, { Component } from 'react'
import SectionMenu from './SectionMenu'
import TimeMenu from './TimeMenu'

class Filters extends Component {
  render() {
    const { activeSection, activeTime, chooseSection, chooseTime } = this.props

    return (
      <div className="d-flex flex-items-center flex-justify-between mb-4">
        <h2 className="subtitle mb-0">Spotify Posts on Reddit</h2>
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
