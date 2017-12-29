import React, { Component } from 'react'
import MultiSelectMenu from './MultiSelectMenu'
import clickOutside from 'react-click-outside'

const itemTypes = {
  album: 'Albums',
  track: 'Tracks',
  playlist: 'Playlists',
  artist: 'Artists'
}
const itemTypeKeys = Object.keys(itemTypes)
const itemTypeCount = itemTypeKeys.length

class ItemTypeMenu extends MultiSelectMenu {
  getHeader() {
    const { activeItems } = this.state
    return `${activeItems.length} of ${itemTypeCount} Spotify types`
  }

  getItems() {
    return itemTypeKeys
  }

  getItemLabel(itemTypeKey) {
    return itemTypes[itemTypeKey]
  }

  handleClickOutside() {
    this.setState(prevState => ({ isOpen: false }))
    this.props.chooseItems(this.state.activeItems)
  }
}

export default clickOutside(ItemTypeMenu)
