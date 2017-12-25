import React, { Component } from 'react'
import RedditAPI from '../models/RedditAPI'
import RedditPost from './RedditPost'
import Filters from './Filters'

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

  render() {
    const { posts, section, time } = this.state

    return (
      <div>
        <section className="hero is-link">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">Playlisdit</h1>
            </div>
          </div>
        </section>
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
