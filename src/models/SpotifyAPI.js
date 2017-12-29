import Fetcher from './Fetcher'
import LocalStorage from './LocalStorage'
import SpotifyProfile from './SpotifyProfile'

const eachSlice = (array, chunkSize) => {
  const result = []
  while (array.length > 0) {
    result.push(array.splice(0, chunkSize))
  }
  return result
}

const isValidTrackURI = uri => {
  if (typeof uri !== 'string') {
    return false
  }
  const parts = uri.split(':')
  if (parts.length < 3) {
    return false
  }
  // Exclude URIs like "spotify:local:Drake:Views:Controlla:245"
  if (parts[0] !== 'spotify' || parts[1] !== 'track') {
    return false
  }
  return parts[2] !== 'null'
}

const tokenKey = 'spotifyToken'

class SpotifyAPI extends Fetcher {
  static isAuthenticated() {
    return LocalStorage.has(tokenKey)
  }

  static authenticate(token) {
    LocalStorage.set(tokenKey, token)
  }

  static signOut() {
    LocalStorage.delete(tokenKey)
    SpotifyProfile.delete()
  }

  static token() {
    return LocalStorage.get(tokenKey)
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

  async addTracksToPlaylist(user, playlistID, allTrackURIs) {
    const headers = SpotifyAPI.authHeaders()
    headers['Content-Type'] = 'application/json'
    const path = `/v1/users/${user}/playlists/${playlistID}/tracks`
    const validTrackURIs = allTrackURIs.filter(uri => isValidTrackURI(uri))
    const uniqueTrackURIs = Array.from(new Set(validTrackURIs))
    for (const uris of eachSlice(uniqueTrackURIs, 100)) {
      try {
        await this.post(path, headers, { uris })
      } catch (error) {
        console.error('failed to add tracks to playlist', error)
      }
    }
  }

  async getPlaylistTracks(user, playlistID, offset, tracks) {
    const limit = 100
    offset = typeof offset === 'number' ? offset : 0
    const path = `/v1/users/${user}/playlists/${playlistID}/tracks?limit=${limit}&offset=${offset}`
    const headers = SpotifyAPI.authHeaders()
    const resp = await this.get(path, headers)
    const newTracks = resp.items.map(item => item.track).filter(track => track && track.uri)
    tracks = (tracks || []).concat(newTracks)
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

  async artists(ids) {
    const idsStr = ids.join(',')
    const headers = SpotifyAPI.authHeaders()
    const resp = await this.get(`/v1/artists?ids=${encodeURIComponent(idsStr)}`, headers)
    const artists = resp.artists
    for (const artist of artists) {
      artist.tracks = await this.artistTopTracks(artist.id)
    }
    return artists
  }

  async artistTopTracks(artistID) {
    const country = SpotifyProfile.load().country
    const headers = SpotifyAPI.authHeaders()
    const resp = await this.get(`/v1/artists/${artistID}/top-tracks?country=${country}`, headers)
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
