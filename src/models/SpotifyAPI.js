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

  static authHeaders() {
    return { Authorization: `Bearer ${SpotifyAPI.token()}` }
  }

  constructor() {
    super('https://api.spotify.com')
  }

  async me() {
    const headers = SpotifyAPI.authHeaders()
    const profile = await this.get('/v1/me', headers)
    if (profile.images && profile.images.length > 0) {
      profile.imageUrl = profile.images[0].url
    }
    profile.url = profile.external_urls.spotify
    return profile
  }

  async createPlaylist(user, name, description) {
    const headers = SpotifyAPI.authHeaders()
    headers['Content-Type'] = 'application/json'
    const body = {
      name,
      public: true,
      collaborative: false,
      description
    }
    const path = `/v1/users/${user}/playlists`
    const playlist = await this.post(path, headers, body)
    playlist.url = playlist.external_urls.spotify
    return playlist
  }

  async addTrackToPlaylist(user, playlistID, uri) {
    return this.addTracksToPlaylist(user, playlistID, [uri])
  }

  async addPlaylistToPlaylist(destUser, destPlaylistID, srcUser, srcPlaylistID) {
    const tracks = await this.getPlaylistTracks(srcUser, srcPlaylistID)
    const uris = tracks.map(track => track.uri)
    return this.addTracksToPlaylist(destUser, destPlaylistID, uris)
  }

  async addAlbumToPlaylist(user, playlistID, albumID) {
    const tracks = await this.getAlbumTracks(albumID)
    const uris = tracks.map(track => track.uri)
    return this.addTracksToPlaylist(user, playlistID, uris)
  }

  addTracksToPlaylist(user, playlistID, trackURIs) {
    const headers = SpotifyAPI.authHeaders()
    headers['Content-Type'] = 'application/json'
    const path = `/v1/users/${user}/playlists/${playlistID}/tracks`
    const uniqueTrackURIs = Array.from(new Set(trackURIs))
    const body = { uris: uniqueTrackURIs }
    return this.post(path, headers, body)
  }

  async getPlaylistTracks(user, playlistID, offset, tracks) {
    const limit = 100
    offset = typeof offset === 'number' ? offset : 0
    const fields = encodeURIComponent('total,items(track(uri))')
    const path = `/v1/users/${user}/playlists/${playlistID}/tracks?fields=${fields}`
    const headers = SpotifyAPI.authHeaders()
    const resp = await this.get(path, headers)
    tracks = (tracks || []).concat(resp.items.map(item => item.track))
    if (resp.total > limit + offset) {
      const restOfTracks = await this.getPlaylistTracks(user, playlistID, offset + limit, tracks)
      tracks = tracks.concat(restOfTracks)
    }
    return tracks
  }

  async getAlbumTracks(albumID, offset, tracks) {
    const limit = 50
    offset = typeof offset === 'number' ? offset : 0
    const path = `/v1/albums/${albumID}/tracks?limit=${limit}&offset=${offset}`
    const headers = SpotifyAPI.authHeaders()
    const resp = await this.get(path, headers)
    tracks = (tracks || []).concat(resp.items)
    if (resp.total > limit + offset) {
      const restOfTracks = await this.getAlbumTracks(albumID, offset + limit, tracks)
      tracks = tracks.concat(restOfTracks)
    }
    return tracks
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
    const headers = SpotifyAPI.authHeaders()
    const resp = await this.get(`/v1/tracks?ids=${encodeURIComponent(idsStr)}`, headers)
    return resp.tracks
  }

  async albums(ids) {
    const idsStr = ids.join(',')
    const headers = SpotifyAPI.authHeaders()
    const resp = await this.get(`/v1/albums?ids=${encodeURIComponent(idsStr)}`, headers)
    return resp.albums
  }

  playlist(user, id) {
    const headers = SpotifyAPI.authHeaders()
    return this.get(`/v1/users/${encodeURIComponent(user)}/playlists/${encodeURIComponent(id)}`, headers)
  }
}

export default SpotifyAPI
