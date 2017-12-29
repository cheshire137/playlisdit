import React, { Component } from 'react'
import ItemTypeMenu from './ItemTypeMenu'

class SpotifyFilters extends Component {
  render() {
    const { activeItemTypes, chooseItemTypes, allowFilteringByItemType } = this.props

    return (
      <div>
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
