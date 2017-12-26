import React, { Component } from 'react'
import ExternalLink from './ExternalLink'

class SpotifyArtist extends Component {
  render() {
    const { name } = this.props
    const url = this.props.external_urls.spotify

    return (
      <ExternalLink
        url={url}
        className="spotify-artist-link"
      >{name}</ExternalLink>
    )
  }
}

export default SpotifyArtist
