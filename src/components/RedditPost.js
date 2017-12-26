import React, { Component } from 'react'
import ExternalLink from './ExternalLink'
import SpotifyPlaylist from './SpotifyPlaylist'
import SpotifyTrack from './SpotifyTrack'
import SpotifyAlbum from './SpotifyAlbum'
import RedditLogo from './RedditLogo'
import SpotifyLogo from './SpotifyLogo'

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
    const { title, permalink, url, spotifyInfo } = this.props
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
        <div>
          <h3>
            <ExternalLink
              url={redditPostUrl}
            >
              <RedditLogo className="mr-1" />
              <span>{title}</span>
            </ExternalLink>
          </h3>
          {spotifyInfo ? (
            <div>
              {spotifyInfo.type === 'playlist' ? (
                <SpotifyPlaylist {...spotifyInfo} />
              ) : spotifyInfo.type === 'track' ? (
                <SpotifyTrack {...spotifyInfo} />
              ) : spotifyInfo.type === 'album' ? (
                <SpotifyAlbum {...spotifyInfo} />
              ) : spotifyInfo.type}
            </div>
          ) : (
            <ExternalLink
              url={url}
              className="spotify-link"
            >
              <SpotifyLogo className="mr-1" />
              <span>View on Spotify</span>
            </ExternalLink>
          )}
        </div>
      </div>
    )
  }
}

export default RedditPost
