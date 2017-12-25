import React, { Component } from 'react'
import RedditAPI from '../models/RedditAPI'
import RedditPost from './RedditPost'
import Filters from './Filters'

class PlaylistView extends Component {
  state = { posts: null, section: 'top' }

  constructor(props) {
    super(props)
    this.redditAPI = new RedditAPI()
  }

  componentDidMount() {
    this.fetchPosts()
  }

  chooseSection(section) {
    this.setState(prevState => ({ section }), () => {
      this.fetchPosts()
    })
  }

  async fetchPosts() {
    const posts = await this.redditAPI.spotifyPosts({
      section: this.state.section
    })
    this.setState(prevState => ({ posts }))
  }

  render() {
    const { posts, section } = this.state

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
                  chooseSection={s => this.chooseSection(s)}
                />
                <ul>
                  {posts.map(post => {
                    return (
                      <li key={post.id}>
                        <RedditPost {...post} />
                      </li>
                    )
                  })}
                </ul>
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
