import React, { Component } from 'react'

const sections = {
  hot: 'Hot',
  new: 'New',
  rising: 'Rising',
  controversial: 'Controversial',
  top: 'Top'
}

class Filters extends Component {
  state = { isOpen: false }

  chooseSection(section) {
    this.setState(prevState => ({ isOpen: false }))
    this.props.chooseSection(section)
  }

  toggleOpen() {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }))
  }

  render() {
    const { isOpen } = this.state
    const { activeSection } = this.props

    return (
      <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <button
            className="button"
            aria-haspopup="true"
            aria-controls="section-menu"
            onClick={() => this.toggleOpen()}
          >
            <span>{sections[activeSection]}</span>
            <span className="icon is-small">
              <i className="ion-arrow-down-b" aria-hidden="true" />
            </span>
          </button>
        </div>
        <div className="dropdown-menu" id="section-menu" role="menu">
          <div className="dropdown-content">
            {Object.keys(sections).map(section => (
              <button
                type="button"
                onClick={() => this.chooseSection(section)}
                key={section}
                className={`dropdown-item button ${section === activeSection ? 'is-active' : ''}`}
              >{sections[section]}</button>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export default Filters
