import React, { Component } from 'react'
import ExternalLink from './ExternalLink'

class RedditPost extends Component {
  getThumbnailUrl() {
    const { preview } = this.props
    if (preview && preview.images) {
      const images = preview.images[0].resolutions
      const image = images.filter(img => img.width > 200)[0]
      if (image) {
        return image.url.replace(/&amp;/g, '&')
      }
    }
    return null
  }

  render() {
    console.log(this.props)
    const { title, permalink, url } = this.props
    const redditPostUrl = `https://www.reddit.com${permalink}`
    const thumbnailUrl = this.getThumbnailUrl()
    const linkStyle = {}
    if (thumbnailUrl) {
      linkStyle.backgroundImage = `url("${thumbnailUrl}")`
    }

    return (
      <div className="d-flex flex-row mb-4">
        {thumbnailUrl ? (
          <ExternalLink
            url={url}
            className="thumbnail-link d-block flex-shrink-0 rounded-2 mr-3"
            style={linkStyle}
          ><img
            src={thumbnailUrl}
            alt={`${title} thumbnail`}
          /></ExternalLink>
        ) : ''}
        <h3>
          <ExternalLink
            url={redditPostUrl}
          >{title}</ExternalLink>
        </h3>
        <div>
          <ExternalLink
            url={url}
          >Spotify</ExternalLink>
        </div>
      </div>
    )
  }
}

export default RedditPost
