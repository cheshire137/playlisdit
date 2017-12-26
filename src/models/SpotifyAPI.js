import Fetcher from './Fetcher'
import Config from '../config.json'
import LocalStorage from './LocalStorage'

class SpotifyAPI extends Fetcher {
  static isAuthenticated() {
    return LocalStorage.has('spotifyToken')
  }

  static authenticate(token) {
    LocalStorage.set('spotifyToken', token)
  }

  static signOut() {
    LocalStorage.delete('spotifyToken')
  }

  constructor(username) {
    super('https://api.spotify.com')
  }

  async tracks(ids) {
    const idsStr = ids.join(',')
    const resp = await this.get(`/v1/tracks?ids=${idsStr}`)
    return resp.tracks
  }
}

export default SpotifyAPI
