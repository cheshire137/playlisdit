import React, { Component } from 'react'
import ExternalLink from './ExternalLink'
import SpotifyPlaylist from './SpotifyPlaylist'
import SpotifyTrack from './SpotifyTrack'
import SpotifyAlbum from './SpotifyAlbum'
import RedditLogo from './RedditLogo'
import SpotifyLogo from './SpotifyLogo'
import NumberHelper from '../models/NumberHelper'

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
    const { title, permalink, url, spotifyInfo, created, score,
            commentsUrl, subreddit, subredditUrl, commentCount,
            date, scoreUnit, commentUnit } = this.props
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
              url={commentsUrl}
              className="reddit-link"
            >
              <RedditLogo className="mr-1" />
              <span>{title}</span>
            </ExternalLink>
          </h3>
          <div className="reddit-post-meta is-size-7 text-gray">
            <ExternalLink
              url={commentsUrl}
              className="text-gray"
            >{date.toLocaleDateString()}</ExternalLink>
            <span> &middot; </span>
            <span title={score}>
              <strong>{NumberHelper.abbreviate(score)}</strong> {scoreUnit}
            </span>
            <span> &middot; </span>
            <ExternalLink
              url={commentsUrl}
              className="text-gray"
              title={commentCount}
            >
              <strong>{NumberHelper.abbreviate(commentCount)}</strong> {commentUnit}
            </ExternalLink>
            <span> &middot; </span>
            <ExternalLink
              url={subredditUrl}
              className="text-gray"
            >{subreddit}</ExternalLink>
          </div>
          {spotifyInfo ? (
            <div>
              {spotifyInfo.type === 'playlist' ? (
                <SpotifyPlaylist {...spotifyInfo} />
              ) : spotifyInfo.type === 'track' ? (
                <SpotifyTrack {...spotifyInfo} className="spotify-link" />
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
