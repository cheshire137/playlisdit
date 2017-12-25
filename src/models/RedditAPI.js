import Fetcher from './Fetcher'
import RedditPost from './RedditPost'

class RedditAPI extends Fetcher {
  constructor(username) {
    super('https://www.reddit.com')
  }

  spotifyPosts(opts) {
    opts = opts || {}
    opts.domain = 'open.spotify.com'
    return this.domainPosts(opts)
  }

  async domainPosts(opts) {
    opts = opts || {}
    const section = opts.section || 'top'
    const path = `/domain/${opts.domain}/${section}.json`
    const resp = await this.get(path)
    return resp.data.children.map(child => child.data)
  }
}

export default RedditAPI
