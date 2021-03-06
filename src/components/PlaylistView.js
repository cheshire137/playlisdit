import React, { Component } from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import RedditAPI from '../models/RedditAPI'
import LocalStorage from '../models/LocalStorage'
import SpotifyAPI from '../models/SpotifyAPI'
import SpotifyProfile from '../models/SpotifyProfile'
import SpotifyFetcherForReddit from '../models/SpotifyFetcherForReddit'
import RedditPost from './RedditPost'
import AudioControls from './AudioControls'
import Filters from './Filters'
import PlaylistHeader from './PlaylistHeader'
import Header from './Header'
import Footer from './Footer'

const allItemTypes = ['album', 'track', 'playlist', 'artist']

const caseInsensitiveCompare = (a, b) => {
  const lowerA = a.toLowerCase()
  const lowerB = b.toLowerCase()
  if (lowerA < lowerB) {
    return -1
  }
  return lowerA > lowerB ? 1 : 0
}

const getActiveItemTypes = () => {
  const deselectedItemTypes = LocalStorage.get('deselectedItemTypes') || []
  return allItemTypes.filter(itemType => deselectedItemTypes.indexOf(itemType) < 0)
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
      isPlaying: false,
      posts: null,
      currentTrack: null,
      spotifyInfo: {},
      activeSubreddits: [],
      activeItemTypes: getActiveItemTypes(),
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
    const currentDeselectedItemTypes = allItemTypes.filter(itemType => activeItemTypes.indexOf(itemType) < 0)
    const pastDeselectedItemTypes = LocalStorage.get('deselectedItemTypes') || []

    const newDeselectedItemTypes = pastDeselectedItemTypes.filter(itemType => activeItemTypes.indexOf(itemType) < 0)
    for (const itemType of currentDeselectedItemTypes) {
      if (newDeselectedItemTypes.indexOf(itemType) < 0) {
        newDeselectedItemTypes.push(itemType)
      }
    }

    LocalStorage.set('deselectedItemTypes', newDeselectedItemTypes)
    this.setState(prevState => ({ activeItemTypes, playlist: null }))
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

    const fetcher = new SpotifyFetcherForReddit(posts)
    const spotifyInfo = await fetcher.getSpotifyInfo()
    this.setState(prevState => ({ spotifyInfo }))
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
      if (item.type === 'artist') {
        return item.tracks.length
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
    const user = SpotifyProfile.load().id

    let playlist
    try {
      playlist = await this.spotifyAPI.createPlaylist(user, name, description)
    } catch (error) {
      console.error('failed to create playlist', error)
      this.setState(prevState => ({ isSaving: false }))
      return
    }

    const seenAlbums = []
    const seenTracks = []
    const seenPlaylists = []
    const seenArtists = []

    for (const item of content) {
      if (item.type === 'album' && seenAlbums.indexOf(item.id) < 0) {
        try {
          await this.spotifyAPI.addAlbumToPlaylist(user, playlist.id, item.id)
          seenAlbums.push(item.id)
        } catch (error) {
          console.error('failed to add album to playlist', error)
        }

      } else if (item.type === 'playlist' && seenPlaylists.indexOf(item.id) < 0) {
        try {
          await this.spotifyAPI.addPlaylistToPlaylist(user, playlist.id, item.owner.id, item.id)
          seenPlaylists.push(item.id)
        } catch (error) {
          console.error('failed to add playlist to playlist', error)
        }

      } else if (item.type === 'track' && seenTracks.indexOf(item.id) < 0) {
        try {
          await this.spotifyAPI.addTrackToPlaylist(user, playlist.id, item.uri)
          seenTracks.push(item.id)
        } catch (error) {
          console.error('failed to add track to playlist', error)
        }

      } else if (item.type === 'artist' && seenArtists.indexOf(item.id) < 0) {
        try {
          const trackURIs = item.tracks.map(track => track.uri)
          await this.spotifyAPI.addTracksToPlaylist(user, playlist.id, trackURIs)
          seenArtists.push(item.id)
        } catch (error) {
          console.error("failed to add artist's tracks to playlist", error)
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

  onAudioPlay(currentTrack) {
    this.setState({ isPlaying: true, currentTrack })
  }

  onAudioPause() {
    this.setState({ isPlaying: false, currentTrack: null })
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
            playlist, activeItemTypes, isPlaying, currentTrack } = this.state
    const filteredPosts = this.filterPosts()
    const trackCount = this.getTrackCount(filteredPosts)
    const anySpotifyInfo = Object.keys(spotifyInfo).length > 0
    const anyPosts = posts && posts.length > 0

    return (
      <div className="layout-container">
        <Header />
        <section className="section layout-children-container">
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
                  showSpotifyFilters={anyPosts && anySpotifyInfo}
                  activeItemTypes={activeItemTypes}
                  activeSubreddits={activeSubreddits}
                  chooseSubreddits={subs => this.chooseSubreddits(subs)}
                  chooseSection={s => this.chooseSection(s)}
                  chooseTime={t => this.chooseTime(t)}
                  chooseItemTypes={types => this.chooseItemTypes(types)}
                />
                {anyPosts ? (
                  <div>
                    {filteredPosts.length > 0 ? (
                      <div>
                        {filteredPosts.map(post => {
                          return (
                            <div key={post.id}>
                              <RedditPost
                                {...post}
                                onAudioPlay={track => this.onAudioPlay(track)}
                                onAudioPause={() => this.onAudioPause()}
                                currentTrack={currentTrack ? { type: currentTrack.type, id: currentTrack.id } : null}
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
        {currentTrack ? (
          <AudioControls
            {...currentTrack}
            onAudioPause={() => this.onAudioPause()}
          />
        ) : ''}
        <Footer />
      </div>
    )
  }
}

export default withRouter(PlaylistView)
