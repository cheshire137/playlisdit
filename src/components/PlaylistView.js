import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import RedditAPI from '../models/RedditAPI'
import SpotifyAPI from '../models/SpotifyAPI'
import RedditPost from './RedditPost'
import Filters from './Filters'
import Header from './Header'

class PlaylistView extends Component {
  state = { posts: null, spotifyInfo: null, section: 'top', time: 'day' }

  constructor(props) {
    super(props)
    this.redditAPI = new RedditAPI()
    this.spotifyAPI = new SpotifyAPI()
  }

  componentDidMount() {
    this.fetchPosts()
  }

  chooseSection(section) {
    this.setState(prevState => ({ section }), () => this.fetchPosts())
  }

  chooseTime(time) {
    this.setState(prevState => ({ time }), () => this.fetchPosts())
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

    for (const post of posts) {
      const url = post.url.toLowerCase()

      if (url.indexOf('/playlist/') > -1) {
        const parts = url.split('/playlist/')
        const head = parts[0].split('/user/')
        const id = parts[parts.length - 1].split('?')[0]
        const user = head[head.length - 1]
        playlistIDs.push({ user, id })
        result[url] = { type: 'playlist', id, user }

      } else if (url.indexOf('/track/') > -1) {
        const parts = url.split('/track/')
        const id = parts[parts.length - 1].split('?')[0]
        trackIDs.push(id)
        result[url] = { type: 'track', id }

      } else if (url.indexOf('/album/') > -1) {
        const parts = url.split('/album/')
        const id = parts[parts.length - 1].split('?')[0]
        albumIDs.push(id)
        result[url] = { type: 'album', id }
      }
    }

    if (trackIDs.length > 0) {
      let tracks
      try {
        tracks = await this.spotifyAPI.tracks(trackIDs)
        console.log('tracks', tracks)
      } catch (error) {
        console.error('failed to fetch Spotify tracks', error)
        if (error.response.status === 401) {
          this.signOut()
          return
        }
      }
    }

    if (albumIDs.length > 0) {
      const albums = await this.spotifyAPI.albums(albumIDs)
      console.log('albums', albums)
    }

    if (playlistIDs.length > 0) {
      for (const playlistID of playlistIDs) {
        this.spotifyAPI.playlist(playlistID.user, playlistID.id).then(playlist => {
          console.log('playlist', playlist)
        }).catch(err => console.error('failed to fetch playlist', err))
      }
    }

    return result
  }

  render() {
    const { posts, section, time } = this.state

    return (
      <div>
        <Header />
        <section className="section">
          <div className="container">
            {posts ? (
              <div>
                <Filters
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
                          <RedditPost {...post} />
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
