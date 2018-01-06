import React, { Component } from 'react'

class PauseButton extends Component {
  render() {
    const { progress } = this.props

    return (
      <div className="radial-progress-container">
        <div className="radial-progress">
          <div className="circle">
            <div className={`fill p${progress}`} />
          </div>
        </div>
        <button
          type="button"
          onClick={this.props.onClick}
          className="button circle"
        >
          <span className="icon">
            <i className="ion-ios-pause" aria-hidden="true" />
          </span>
        </button>
      </div>
    )
  }
}

export default PauseButton
