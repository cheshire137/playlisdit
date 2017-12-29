import React, { Component } from 'react'
import MultiSelectMenu from './MultiSelectMenu'

const itemTypes = {
  album: 'Albums',
  track: 'Tracks',
  playlist: 'Playlists',
  artist: 'Artists'
}
const itemTypeKeys = Object.keys(itemTypes)
const itemTypeCount = itemTypeKeys.length

class ItemTypeMenu extends Component {
  render() {
    const { activeItems, chooseItems } = this.props
    const header = `${activeItems.length} of ${itemTypeCount} types`

    return (
      <MultiSelectMenu
        header={header}
        items={itemTypeKeys}
        getLabel={itemTypeKey => itemTypes[itemTypeKey]}
        activeItems={activeItems}
        chooseItems={chooseItems}
      />
    )
  }
}

export default ItemTypeMenu
