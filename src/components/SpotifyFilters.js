import React, { Component } from 'react'
import ItemTypeMenu from './ItemTypeMenu'

class SpotifyFilters extends Component {
  render() {
    const { activeItemTypes, chooseItemTypes, allowFilteringByItemType } = this.props

    return (
      <div className="d-flex flex-items-center">
        <span className="mr-3">Spotify filters:</span>

        {allowFilteringByItemType ? (
          <ItemTypeMenu
            activeItems={activeItemTypes}
            chooseItems={chooseItemTypes}
          />
        ) : ''}
      </div>
    )
  }
}

export default SpotifyFilters
