import React, { Component } from 'react'
import ExternalLink from './ExternalLink'

class Footer extends Component {
  render() {
    return (
      <footer className="footer text-small">
        <div className="container">
          <div className="content has-text-centered">
            <span>Built with &hearts; by </span>
            <ExternalLink
              url="http://sarahvessels.com/"
            >Sarah</ExternalLink>
            <span> &middot; </span>
            <ExternalLink
              url="https://github.com/cheshire137/playlisdit"
            >View source</ExternalLink>
          </div>
        </div>
      </footer>
    )
  }
}

export default Footer
