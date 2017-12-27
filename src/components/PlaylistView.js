import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import RedditAPI from '../models/RedditAPI'
import LocalStorage from '../models/LocalStorage'
import SpotifyAPI from '../models/SpotifyAPI'
import RedditPost from './RedditPost'
import Filters from './Filters'
import Header from './Header'

const caseInsensitiveCompare = (a, b) => {
  const lowerA = a.toLowerCase()
  const lowerB = b.toLowerCase()
  if (lowerA < lowerB) {
    return -1
  }
  return lowerA > lowerB ? 1 : 0
}

const getSubreddits = posts => {
  const result = []
  if (!posts || posts.length < 1) {
    return result
  }

  for (const post of posts) {
    if (result.indexOf(post.subreddit) < 0) {
      result.push(post.subreddit)
    }
  }

  return result.sort(caseInsensitiveCompare)
}

class PlaylistView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      posts: null,
      spotifyInfo: {},
      activeSubreddits: [],
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

  chooseSubreddits(activeSubreddits) {
    const allSubreddits = this.state.subreddits
    const currentDeselectedSubreddits = allSubreddits.filter(subreddit => activeSubreddits.indexOf(subreddit) < 0)
    const pastDeselectedSubreddits = LocalStorage.get('deselectedSubreddits') || []
    const newDeselectedSubreddits = []
    for (const subreddit of pastDeselectedSubreddits) {
      const isDeselected = activeSubreddits.indexOf(subreddit) < 0
      const isAvailable = allSubreddits.indexOf(subreddit) > -1
      if (isDeselected && isAvailable) {
        newDeselectedSubreddits.push(subreddit)
      }
    }
    for (const subreddit of currentDeselectedSubreddits) {
      if (newDeselectedSubreddits.indexOf(subreddit) < 0) {
        newDeselectedSubreddits.push(subreddit)
      }
    }
    LocalStorage.set('deselectedSubreddits', newDeselectedSubreddits)
    this.setState(prevState => ({ activeSubreddits }))
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

    const subreddits = getSubreddits(posts)
    const activeSubreddits = []
    const deselectedSubreddits = LocalStorage.get('deselectedSubreddits') || []
    for (const subreddit of subreddits) {
      if (deselectedSubreddits.indexOf(subreddit) < 0) {
        activeSubreddits.push(subreddit)
      }
    }

    this.setState(prevState => ({ posts, subreddits, activeSubreddits }))

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

  getTrackCount(visiblePosts) {
    const { spotifyInfo } = this.state
    if (Object.keys(spotifyInfo).length < 1) {
      return null
    }

    const spotifyItems = visiblePosts.map(post => spotifyInfo[post.pathname]).filter(item => item)
    const counts = spotifyItems.map(item => {
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
    const { posts, section, time, spotifyInfo, activeSubreddits,
            subreddits } = this.state
    let filteredPosts = []
    if (posts) {
      filteredPosts = posts.filter(post => activeSubreddits.indexOf(post.subreddit) > -1)
    }
    const trackCount = this.getTrackCount(filteredPosts)

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
                  subreddits={subreddits}
                  activeSubreddits={activeSubreddits}
                  chooseSubreddits={subs => this.chooseSubreddits(subs)}
                  chooseSection={s => this.chooseSection(s)}
                  chooseTime={t => this.chooseTime(t)}
                />
                {posts.length > 0 ? (
                  <div>
                    {filteredPosts.length > 0 ? (
                      <div>
                        {filteredPosts.map(post => {
                          return (
                            <div key={post.id}>
                              <RedditPost
                                {...post}
                                spotifyInfo={spotifyInfo[post.pathname]}
                              />
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <p>No {section} Spotify posts on Reddit match your filters.</p>
                    )}
                  </div>
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
