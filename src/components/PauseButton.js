import React, { Component } from 'react'

class PauseButton extends Component {
  render() {
    const { progress } = this.props

    return (
      <div className="radial-progress-container py-0 px-2 mr-2">
        <div className={`c100 p${progress} center`}>
          <span />
          <div className="slice">
            <div className="bar" />
            <div className="fill" />
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
