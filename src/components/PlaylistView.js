import React, { Component } from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import RedditAPI from '../models/RedditAPI'
import LocalStorage from '../models/LocalStorage'
import SpotifyAPI from '../models/SpotifyAPI'
import RedditPost from './RedditPost'
import Filters from './Filters'
import PlaylistHeader from './PlaylistHeader'
import Header from './Header'

const caseInsensitiveCompare = (a, b) => {
  const lowerA = a.toLowerCase()
  const lowerB = b.toLowerCase()
  if (lowerA < lowerB) {
    return -1
  }
  return lowerA > lowerB ? 1 : 0
}

const getActiveSubreddits = subreddits => {
  const deselectedSubreddits = LocalStorage.get('deselectedSubreddits') || []
  return subreddits.filter(subreddit => deselectedSubreddits.indexOf(subreddit) < 0)
}

const getPlaylistDescription = subreddits => {
  const attribution = 'Made by Playlisdit.'
  if (subreddits.length < 1) {
    return attribution
  }

  const subredditList = subreddits.join(', ')
  const unit = subreddits.length === 1 ? 'subreddit' : 'subreddits'
  return `Songs from Reddit's ${subredditList} ${unit}. ${attribution}`
}

const getPlaylistName = (section, time) => {
  let name = ''
  if (section === 'hot') {
    name += 'Hot'
  } else if (section === 'top') {
    name += 'Top'
  } else if (section === 'rising') {
    name += 'Rising'
  } else if (section === 'controversial') {
    name += 'Controversial'
  } else if (section === 'new') {
    name += 'New'
  }
  name += ' Reddit Posts'
  if (section === 'top') {
    name += ' from '
    if (time === 'hour') {
      name += 'the Past Hour'
    } else if (time === 'day') {
      name += 'the Past 24 Hours'
    } else if (time === 'week') {
      name += 'the Past Week'
    } else if (time === 'month') {
      name += 'the Past Month'
    } else if (time === 'year') {
      name += 'the Past Year'
    } else if (time === 'all') {
      name += 'All Time'
    }
  }
  const date = new Date()
  const timestamp = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  name += ` - ${timestamp}`
  return name
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
      activeItemTypes: ['album', 'track', 'playlist', 'artist'],
      playlist: null,
      isSaving: false,
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
      section: section || 'top', time: time || 'day', playlist: null
    }), () => this.fetchRedditPosts())
  }

  componentDidMount() {
    this.fetchRedditPosts()
  }

  chooseItemTypes(activeItemTypes) {
    this.setState(prevState => ({ activeItemTypes }))
  }

  chooseSubreddits(activeSubreddits) {
    const allSubreddits = this.state.subreddits
    const currentDeselectedSubreddits = allSubreddits.filter(subreddit => activeSubreddits.indexOf(subreddit) < 0)
    const pastDeselectedSubreddits = LocalStorage.get('deselectedSubreddits') || []
    const newDeselectedSubreddits = []

    for (const subreddit of pastDeselectedSubreddits) {
      const isDeselected = activeSubreddits.indexOf(subreddit) < 0
      const isAvailable = allSubreddits.indexOf(subreddit) > -1
      if (isDeselected && isAvailable || !isAvailable) {
        newDeselectedSubreddits.push(subreddit)
      }
    }

    for (const subreddit of currentDeselectedSubreddits) {
      if (newDeselectedSubreddits.indexOf(subreddit) < 0) {
        newDeselectedSubreddits.push(subreddit)
      }
    }

    LocalStorage.set('deselectedSubreddits', newDeselectedSubreddits)
    this.setState(prevState => ({ activeSubreddits, playlist: null }))
  }

  chooseSection(section) {
    this.props.history.push(`/playlist/${section}`)
  }

  chooseTime(time) {
    this.props.history.push(`/playlist/top/${time}`)
  }

  async fetchRedditPosts() {
    const { section, time } = this.state

    let posts
    try {
      posts = await this.redditAPI.spotifyPosts({
        section, time, limit: 10
      })
    } catch (error) {
      console.error('failed to fetch Spotify posts from Reddit', error)
    }
    if (!posts) {
      return
    }

    const subreddits = getSubreddits(posts)
    const activeSubreddits = getActiveSubreddits(subreddits)
    this.setState(prevState => ({ posts, subreddits, activeSubreddits, playlist: null }))

    const spotifyInfo = await this.getSpotifyInfo()
    this.setState(prevState => ({ spotifyInfo }))
  }

  async getSpotifyInfo() {
    const { posts } = this.state
    const result = {}
    const trackIDs = []
    const albumIDs = []
    const artistIDs = []
    const playlistIDs = []
    const postPathnamesByTrackID = {}
    const postPathnamesByAlbumID = {}
    const postPathnamesByPlaylistID = {}
    const postPathnamesByArtistID = {}

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

      } else if (lowercasePathname.indexOf('/artist/') > -1) {
        const parts = pathname.split(/\/artist\//i)
        const id = parts[parts.length - 1].split('?')[0]
        artistIDs.push(id)
        postPathnamesByArtistID[id] = pathname

      } else {
        console.log('unrecognized Spotify type', pathname)
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
          SpotifyAPI.signOut()
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
          SpotifyAPI.signOut()
          return
        }
      }
    }

    if (artistIDs.length > 0) {
      let artists
      try {
        artists = await this.spotifyAPI.artists(artistIDs)
        for (const artist of artists) {
          const pathname = postPathnamesByArtistID[artist.id]
          result[pathname] = artist
        }
      } catch (error) {
        console.error('failed to fetch Spotify artists', error)
        if (error.response.status === 401) {
          SpotifyAPI.signOut()
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
            SpotifyAPI.signOut()
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

  async savePlaylist() {
    this.setState(prevState => ({ isSaving: true, playlist: null }))

    const { spotifyInfo, section, time, activeSubreddits } = this.state
    const filteredPosts = this.filterPosts()
    const content = []
    for (const post of filteredPosts) {
      content.push(spotifyInfo[post.pathname])
    }
    const name = getPlaylistName(section, time)
    const description = getPlaylistDescription(activeSubreddits)
    const api = new SpotifyAPI()

    let profile
    try {
      profile = await api.me()
    } catch (error) {
      console.error('failed to get Spotify profile', error)
      this.setState(prevState => ({ isSaving: false }))
      return
    }
    const user = profile.id

    let playlist
    try {
      playlist = await api.createPlaylist(user, name, description)
    } catch (error) {
      console.error('failed to create playlist', error)
      this.setState(prevState => ({ isSaving: false }))
      return
    }

    const seenAlbums = []
    const seenTracks = []
    const seenPlaylists = []

    for (const item of content) {
      if (item.type === 'album' && seenAlbums.indexOf(item.id) < 0) {
        try {
          await api.addAlbumToPlaylist(user, playlist.id, item.id)
          seenAlbums.push(item.id)
        } catch (error) {
          console.error('failed to add album to playlist', error)
        }

      } else if (item.type === 'playlist' && seenPlaylists.indexOf(item.id) < 0) {
        try {
          await api.addPlaylistToPlaylist(user, playlist.id, item.owner.id, item.id)
          seenPlaylists.push(item.id)
        } catch (error) {
          console.error('failed to add playlist to playlist', error)
        }

      } else if (item.type === 'track' && seenTracks.indexOf(item.id) < 0) {
        try {
          await api.addTrackToPlaylist(user, playlist.id, item.uri)
          seenTracks.push(item.id)
        } catch (error) {
          console.error('failed to add track to playlist', error)
        }
      }
    }

    this.setState(prevState => ({ isSaving: false, playlist }))
  }

  filterPosts() {
    const { posts, activeSubreddits, activeItemTypes, spotifyInfo } = this.state
    const anySpotifyInfo = Object.keys(spotifyInfo).length > 0
    let filteredPosts = []

    if (posts) {
      filteredPosts = posts.filter(post => {
        const isSubredditSelected = activeSubreddits.indexOf(post.subreddit) > -1
        const postSpotifyInfo = spotifyInfo[post.pathname]
        const isItemTypeSelected = !anySpotifyInfo ||
          postSpotifyInfo && activeItemTypes.indexOf(postSpotifyInfo.type) > -1

        return isSubredditSelected && isItemTypeSelected
      })
    }

    return filteredPosts
  }

  render() {
    if (!SpotifyAPI.isAuthenticated()) {
      return (
        <Redirect to={{
          pathname: '/',
          state: { from: this.props.location }
        }} />
      )
    }

    const { posts, section, time, spotifyInfo, activeSubreddits, subreddits, isSaving,
            playlist, activeItemTypes } = this.state
    const filteredPosts = this.filterPosts()
    const trackCount = this.getTrackCount(filteredPosts)
    const anySpotifyInfo = Object.keys(spotifyInfo).length > 0

    return (
      <div>
        <Header />
        <section className="section">
          <div className="container">
            {posts ? (
              <div>
                <PlaylistHeader
                  playlist={playlist}
                  isSaving={isSaving}
                  allowSave={!isSaving && anySpotifyInfo && !playlist}
                  trackCount={trackCount}
                  savePlaylist={() => this.savePlaylist()}
                />
                <Filters
                  allowFilteringByItemType={anySpotifyInfo}
                  activeSection={section}
                  activeTime={time}
                  subreddits={subreddits}
                  activeItemTypes={activeItemTypes}
                  activeSubreddits={activeSubreddits}
                  chooseSubreddits={subs => this.chooseSubreddits(subs)}
                  chooseSection={s => this.chooseSection(s)}
                  chooseTime={t => this.chooseTime(t)}
                  chooseItemTypes={types => this.chooseItemTypes(types)}
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
