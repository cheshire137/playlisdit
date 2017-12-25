import React, { Component } from 'react'
import SectionMenu from './SectionMenu'

class Filters extends Component {
  render() {
    const { activeSection, chooseSection } = this.props

    return (
      <div className="d-flex flex-items-center flex-justify-between mb-4">
        <h2 className="subtitle mb-0">Spotify Posts on Reddit</h2>
        <SectionMenu activeSection={activeSection} chooseSection={chooseSection} />
      </div>
    )
  }
}

export default Filters
