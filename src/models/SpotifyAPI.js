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

  static token() {
    return LocalStorage.get('spotifyToken')
  }

  constructor(username) {
    super('https://api.spotify.com')
  }

  async tracks(ids) {
    const idsStr = ids.join(',')
    const headers = {
      Authorization: `Bearer ${SpotifyAPI.token()}`
    }
    const resp = await this.get(`/v1/tracks?ids=${idsStr}`, headers)
    return resp.tracks
  }

  async albums(ids) {
    const idsStr = ids.join(',')
    const headers = {
      Authorization: `Bearer ${SpotifyAPI.token()}`
    }
    const resp = await this.get(`/v1/albums?ids=${idsStr}`, headers)
    return resp.albums
  }

  playlist(user, id) {
    return this.get(`/v1/users/${user}/playlists/${id}`)
  }
}

export default SpotifyAPI
