import Fetcher from './Fetcher'
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

  constructor() {
    super('https://api.spotify.com')
  }

  async me() {
    const headers = {
      Authorization: `Bearer ${SpotifyAPI.token()}`
    }
    const profile = await this.get('/v1/me', headers)
    if (profile.images && profile.images.length > 0) {
      profile.imageUrl = profile.images[0].url
    }
    profile.url = profile.external_urls.spotify
    return profile
  }

  createPlaylist(user, name, description) {
    const headers = {
      Authorization: `Bearer ${SpotifyAPI.token()}`,
      'Content-Type': 'application/json'
    }
    const body = {
      name,
      public: true,
      collaborative: false,
      description
    }
    console.log(body, headers)
    const path = `/v1/users/${user}/playlists`
    return this.post(path, headers, body)
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
    const resp = await this.get(`/v1/tracks?ids=${encodeURIComponent(idsStr)}`, headers)
    return resp.tracks
  }

  async albums(ids) {
    const idsStr = ids.join(',')
    const headers = {
      Authorization: `Bearer ${SpotifyAPI.token()}`
    }
    const resp = await this.get(`/v1/albums?ids=${encodeURIComponent(idsStr)}`, headers)
    return resp.albums
  }

  playlist(user, id) {
    const headers = {
      Authorization: `Bearer ${SpotifyAPI.token()}`
    }
    return this.get(`/v1/users/${encodeURIComponent(user)}/playlists/${encodeURIComponent(id)}`, headers)
  }
}

export default SpotifyAPI
