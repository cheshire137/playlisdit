import React, { Component } from 'react'
import clickOutside from 'react-click-outside'

const times = {
  hour: 'Past hour',
  day: 'Past 24 hours',
  week: 'Past week',
  month: 'Past month',
  year: 'Past year',
  all: 'All time'
}

class TimeMenu extends Component {
  state = { isOpen: false }

  chooseTime(time) {
    this.setState(prevState => ({ isOpen: false }))
    this.props.chooseTime(time)
  }

  handleClickOutside() {
    this.setState(prevState => ({ isOpen: false }))
  }

  toggleOpen() {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }))
  }

  render() {
    const { isOpen } = this.state
    const { activeTime } = this.props

    return (
      <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <button
            className="button"
            aria-haspopup="true"
            aria-controls="section-menu"
            onClick={() => this.toggleOpen()}
          >
            <span>Time frame: {times[activeTime]}</span>
            <span className="icon is-small">
              <i className="ion-arrow-down-b" aria-hidden="true" />
            </span>
          </button>
        </div>
        <div className="dropdown-menu" id="section-menu" role="menu">
          <div className="dropdown-content">
            {Object.keys(times).map(time => (
              <button
                type="button"
                onClick={() => this.chooseTime(time)}
                key={time}
                className={`dropdown-item button ${time === activeTime ? 'is-active' : ''}`}
              >{times[time]}</button>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export default clickOutside(TimeMenu)
