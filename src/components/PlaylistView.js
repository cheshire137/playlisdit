import React, { Component } from 'react'
import RedditAPI from '../models/RedditAPI'

class PlaylistView extends Component {
  state = { posts: null }

  constructor(props) {
    super(props)
    this.redditAPI = new RedditAPI()
  }

  async componentDidMount() {
    const posts = await this.redditAPI.spotifyPosts()
    this.setState(prevState => ({ posts }))
  }

  render() {
    const { posts } = this.state

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
              <ul>
                {posts.map(post => {
                  return (
                    <li key={post.id}>
                      {post.title}
                    </li>
                  )
                })}
              </ul>
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
