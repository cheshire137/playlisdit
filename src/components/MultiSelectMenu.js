import React, { Component } from 'react'

class MultiSelectMenu extends Component {
  constructor(props) {
    super(props)
    console.log('MultiSelectMenu', props)
    this.state = { isOpen: false, activeItems: props.activeItems }
  }

  componentWillReceiveProps(props) {
    this.setState(prevState => ({ activeItems: props.activeItems }))
  }

  toggleItemSelected(item) {
    let activeItems = this.state.activeItems.slice(0)
    const index = activeItems.indexOf(item)

    if (index > -1) {
      const head = activeItems.slice(0, index)
      const tail = activeItems.slice(index + 1, activeItems.length)
      activeItems = head.concat(tail)
    } else {
      activeItems.push(item)
    }

    this.setState(prevState => ({ activeItems }))
  }

  toggleOpen() {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }))
  }

  getHeader() {
    return 'Select items'
  }

  getItems() {
    return []
  }

  getItemLabel(item) {
    return item
  }

  render() {
    const { isOpen, activeItems } = this.state

    return (
      <div className={`dropdown mr-3 ${isOpen ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <button
            className="button"
            aria-haspopup="true"
            aria-controls="item-type-menu"
            onClick={() => this.toggleOpen()}
          >
            <span>{this.getHeader()}</span>
            <span className="icon is-small">
              <i className="ion-arrow-down-b" aria-hidden="true" />
            </span>
          </button>
        </div>
        <div className="dropdown-menu" id="item-type-menu" role="menu">
          <div className="dropdown-content">
            {this.getItems().map(item => {
              const isActive = activeItems.indexOf(item) > -1
              const domID = `item-checkbox-${item}`

              return (
                <label
                  htmlFor={domID}
                  key={item}
                  className={`checkbox no-wrap dropdown-item ${isActive ? 'is-active' : ''}`}
                >
                  <input
                    checked={isActive}
                    type="checkbox"
                    className="mr-2"
                    id={domID}
                    onChange={() => this.toggleItemSelected(item)}
                  />
                  {this.getItemLabel(item)}
                </label>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
}

export default MultiSelectMenu
