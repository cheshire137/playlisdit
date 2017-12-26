import React, { Component } from 'react'
import RedditAPI from '../models/RedditAPI'
import RedditPost from './RedditPost'
import Filters from './Filters'
import Header from './Header'

class PlaylistView extends Component {
  state = { posts: null, section: 'top', time: 'day' }

  constructor(props) {
    super(props)
    this.redditAPI = new RedditAPI()
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

  async fetchPosts() {
    const { section, time } = this.state
    const posts = await this.redditAPI.spotifyPosts({
      section, time
    })
    this.setState(prevState => ({ posts }))
  }

  getSpotifyIDs() {
    const { posts } = this.state
    const result = {}

    for (const post of posts) {
      const url = post.url.toLowerCase()

      if (url.indexOf('/playlist/') > -1) {
        const parts = url.split('/playlist/')
        const head = parts[0].split('/user/')
        result[url] = {
          type: 'playlist',
          id: parts[parts.length - 1].split('?')[0],
          user: head[head.length - 1]
        }

      } else if (url.indexOf('/track/') > -1) {
        const parts = url.split('/track/')
        result[url] = {
          type: 'track',
          id: parts[parts.length - 1].split('?')[0]
        }

      } else if (url.indexOf('/album/') > -1) {
        const parts = url.split('/album/')
        result[url] = {
          type: 'album',
          id: parts[parts.length - 1].split('?')[0]
        }
      }
    }

    return result
  }

  render() {
    const { posts, section, time } = this.state
    const spotifyIDs = posts ? this.getSpotifyIDs() : {}

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

export default PlaylistView
