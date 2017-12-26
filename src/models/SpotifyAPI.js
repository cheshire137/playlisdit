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

  async search(query, type, limit, offset) {
    let path = `/v1/search?q=${encodeURIComponent(query)}` +
      `&type=${type}`
    if (typeof limit === 'number') {
      path += `&limit=${limit}`
    }
    if (typeof offset === 'number') {
      path += `&offset=${offset}`
    }
    const resp = await this.get(path)
    if (type === 'album') {
      return resp.albums
    }
    if (type === 'artist') {
      return resp.artists
    }
    if (type === 'playlist') {
      return resp.playlists
    }
    if (type === 'track') {
      return resp.tracks
    }
    return resp
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
    const headers = {
      Authorization: `Bearer ${SpotifyAPI.token()}`
    }
    return this.get(`/v1/users/${user}/playlists/${id}`, headers)
  }
}

export default SpotifyAPI
