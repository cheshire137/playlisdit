import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import RedditAPI from '../models/RedditAPI'
import SpotifyAPI from '../models/SpotifyAPI'
import RedditPost from './RedditPost'
import Filters from './Filters'
import Header from './Header'

class PlaylistView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      posts: null,
      spotifyInfo: {},
      time: props.match.params.time || 'day',
      section: props.match.params.section || 'top'
    }
    this.redditAPI = new RedditAPI()
    this.spotifyAPI = new SpotifyAPI()
  }

  componentWillReceiveProps(props) {
    const params = props.match.params
    const { section, time } = params
    this.setState(prevState => ({
      section: section || 'top', time: time || 'day'
    }), () => this.fetchPosts())
  }

  componentDidMount() {
    this.fetchPosts()
  }

  chooseSection(section) {
    this.props.history.push(`/playlist/${section}`)
  }

  chooseTime(time) {
    this.props.history.push(`/playlist/top/${time}`)
  }

  signOut() {
    SpotifyAPI.signOut()
    this.props.history.push('/')
  }

  async fetchPosts() {
    const { section, time } = this.state
    let posts
    try {
      posts = await this.redditAPI.spotifyPosts({
        section, time
      })
    } catch (error) {
      console.error('failed to fetch Spotify posts from Reddit', error)
    }

    if (!posts) {
      return
    }

    this.setState(prevState => ({ posts }))

    const spotifyInfo = await this.getSpotifyInfo()
    this.setState(prevState => ({ spotifyInfo }))
  }

  async getSpotifyInfo() {
    const { posts } = this.state
    const result = {}
    const trackIDs = []
    const albumIDs = []
    const playlistIDs = []
    const postPathnamesByTrackID = {}
    const postPathnamesByAlbumID = {}
    const postPathnamesByPlaylistID = {}

    for (const post of posts) {
      const pathname = post.pathname
      const lowercasePathname = pathname.toLowerCase()

      if (lowercasePathname.indexOf('/playlist/') > -1) {
        const parts = pathname.split(/\/playlist\//i)
        const head = parts[0].split('/user/')
        const id = parts[parts.length - 1].split('?')[0]
        const user = head[head.length - 1]
        playlistIDs.push({ user, id })
        postPathnamesByPlaylistID[id] = pathname

      } else if (lowercasePathname.indexOf('/track/') > -1) {
        const parts = pathname.split(/\/track\//i)
        const id = parts[parts.length - 1].split('?')[0]
        trackIDs.push(id)
        postPathnamesByTrackID[id] = pathname

      } else if (lowercasePathname.indexOf('/album/') > -1) {
        const parts = pathname.split(/\/album\//i)
        const id = parts[parts.length - 1].split('?')[0]
        albumIDs.push(id)
        postPathnamesByAlbumID[id] = pathname
      }
    }

    if (trackIDs.length > 0) {
      let tracks
      try {
        tracks = await this.spotifyAPI.tracks(trackIDs)
        for (const track of tracks) {
          const pathname = postPathnamesByTrackID[track.id]
          result[pathname] = track
        }
      } catch (error) {
        console.error('failed to fetch Spotify tracks', error)
        if (error.response.status === 401) {
          this.signOut()
          return
        }
      }
    }

    if (albumIDs.length > 0) {
      let albums
      try {
        albums = await this.spotifyAPI.albums(albumIDs)
        for (const album of albums) {
          const pathname = postPathnamesByAlbumID[album.id]
          result[pathname] = album
        }
      } catch (error) {
        console.error('failed to fetch Spotify albums', error)
        if (error.response.status === 401) {
          this.signOut()
          return
        }
      }
    }

    if (playlistIDs.length > 0) {
      for (const playlistID of playlistIDs) {
        let playlist
        try {
          playlist = await this.spotifyAPI.playlist(playlistID.user, playlistID.id)
          const pathname = postPathnamesByPlaylistID[playlist.id]
          result[pathname] = playlist
        } catch (error) {
          console.error('failed to fetch playlist', error)
          if (error.response.status === 401) {
            this.signOut()
            return
          }
        }
      }
    }

    return result
  }

  getTrackCount() {
    const { spotifyInfo } = this.state
    const counts = Object.values(spotifyInfo).map(item => {
      if (item.type === 'album' || item.type === 'playlist') {
        return item.tracks.total
      }
      return 1
    })

    if (counts.length < 1) {
      return null
    }

    return counts.reduce((acc, val) => acc + val)
  }

  render() {
    const { posts, section, time, spotifyInfo } = this.state
    const trackCount = this.getTrackCount()

    return (
      <div>
        <Header />
        <section className="section">
          <div className="container">
            {posts ? (
              <div>
                <Filters
                  trackCount={trackCount}
                  activeSection={section}
                  activeTime={time}
                  chooseSection={s => this.chooseSection(s)}
                  chooseTime={t => this.chooseTime(t)}
                />
                {posts.length > 0 ? (
                  <ul>
                    {posts.map(post => {
                      return (
                        <li key={post.id}>
                          <RedditPost
                            {...post}
                            spotifyInfo={spotifyInfo[post.pathname]}
                          />
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <p>No {section} Spotify posts on Reddit.</p>
                )}
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </section>
      </div>
    )
  }
}

export default withRouter(PlaylistView)
