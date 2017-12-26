import Fetcher from './Fetcher'

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
    let section = ''
    if (opts.section && opts.section !== 'hot') {
      section = `/${opts.section}`
    }
    let path = `/domain/${opts.domain}${section}.json`
    if (opts.time && opts.section === 'top') {
      path += `?t=${opts.time}`
    }
    const resp = await this.get(path)
    return resp.data.children.map(child => child.data)
  }
}

export default RedditAPI
