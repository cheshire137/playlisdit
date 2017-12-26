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
    return resp.data.children.map(child => {
      const post = child.data
      if (post.url) {
        post.pathname = new URL(post.url).pathname
      }
      post.commentsUrl = `https://www.reddit.com${post.permalink}`
      post.subreddit = post.subreddit_name_prefixed
      post.subredditUrl = `https://www.reddit.com${post.subreddit}`
      post.commentCount = post.num_comments
      post.commentUnit = post.commentCount === 1 ? 'comment' : 'comments'
      post.date = new Date(post.created * 1000)
      post.scoreUnit = post.score === 1 ? 'point' : 'points'
      return post
    })
  }
}

export default RedditAPI
