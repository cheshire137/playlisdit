import SpotifyAPI from './SpotifyAPI'

export default class SpotifyRedditPost {
  constructor(posts) {
    this.posts = posts
    this.spotifyAPI = new SpotifyAPI()
  }

  async getSpotifyInfo() {
    const tracksByPostPathname = await this.getSpotifyTracksByPostPathname(),
      albumsByPostPathname = await this.getSpotifyAlbumsByPostPathname(),
      artistsByPostPathname = await this.getSpotifyArtistsByPostPathname(),
      playlistsByPostPathname = await this.getSpotifyPlaylistsByPostPathname()

    return Object.assign({}, tracksByPostPathname, albumsByPostPathname,
                         artistsByPostPathname, playlistsByPostPathname)
  }

  async getSpotifyTracksByPostPathname() {
    const trackIDs = []
    const postPathnamesByTrackID = {}
    const result = {}

    for (const post of this.posts) {
      const pathname = post.pathname
      const lowercasePathname = pathname.toLowerCase()

      if (lowercasePathname.indexOf('/track/') > -1) {
        const parts = pathname.split(/\/track\//i)
        const id = parts[parts.length - 1].split('?')[0]

        trackIDs.push(id)
        postPathnamesByTrackID[id] = pathname
      }
    }

    if (trackIDs.length > 0) {
      let tracks

      try {
        tracks = await this.spotifyAPI.tracks(trackIDs)

        for (const track of tracks) {
          const pathname = postPathnamesByTrackID[track.id]
          result[pathname] = track
        }
      } catch (error) {
        console.error('failed to fetch Spotify tracks', error)

        if (error.response.status === 401) {
          SpotifyAPI.signOut()
        }
      }
    }

    return result
  }

  async getSpotifyAlbumsByPostPathname() {
    const result = {}
    const albumIDs = []
    const postPathnamesByAlbumID = {}

    for (const post of this.posts) {
      const pathname = post.pathname
      const lowercasePathname = pathname.toLowerCase()

      if (lowercasePathname.indexOf('/album/') > -1) {
        const parts = pathname.split(/\/album\//i)
        const id = parts[parts.length - 1].split('?')[0]

        albumIDs.push(id)
        postPathnamesByAlbumID[id] = pathname
      }
    }

    if (albumIDs.length > 0) {
      let albums

      try {
        albums = await this.spotifyAPI.albums(albumIDs)

        for (const album of albums) {
          const pathname = postPathnamesByAlbumID[album.id]
          result[pathname] = album
        }
      } catch (error) {
        console.error('failed to fetch Spotify albums', error)

        if (error.response.status === 401) {
          SpotifyAPI.signOut()
        }
      }
    }

    return result
  }

  async getSpotifyArtistsByPostPathname() {
    const result = {}
    const artistIDs = []
    const postPathnamesByArtistID = {}

    for (const post of this.posts) {
      const pathname = post.pathname
      const lowercasePathname = pathname.toLowerCase()

      if (lowercasePathname.indexOf('/artist/') > -1) {
        const parts = pathname.split(/\/artist\//i)
        const id = parts[parts.length - 1].split('?')[0]
        artistIDs.push(id)
        postPathnamesByArtistID[id] = pathname
      }
    }

    if (artistIDs.length > 0) {
      let artists

      try {
        artists = await this.spotifyAPI.artists(artistIDs)

        for (const artist of artists) {
          const pathname = postPathnamesByArtistID[artist.id]
          result[pathname] = artist
        }
      } catch (error) {
        console.error('failed to fetch Spotify artists', error)

        if (error.response.status === 401) {
          SpotifyAPI.signOut()
        }
      }
    }

    return result
  }

  async getSpotifyPlaylistsByPostPathname() {
    const result = {}
    const playlistIDs = []
    const postPathnamesByPlaylistID = {}

    for (const post of this.posts) {
      const pathname = post.pathname
      const lowercasePathname = pathname.toLowerCase()

      if (lowercasePathname.indexOf('/playlist/') > -1) {
        const parts = pathname.split(/\/playlist\//i)
        const head = parts[0].split('/user/')
        const id = parts[parts.length - 1].split('?')[0]
        const user = head[head.length - 1]

        playlistIDs.push({ user, id })
        postPathnamesByPlaylistID[id] = pathname
      }
    }

    if (playlistIDs.length > 0) {
      for (const playlistID of playlistIDs) {
        let playlist

        try {
          playlist = await this.spotifyAPI.playlist(playlistID.user, playlistID.id)

          const pathname = postPathnamesByPlaylistID[playlist.id]
          result[pathname] = playlist
        } catch (error) {
          console.error('failed to fetch playlist', error)

          if (error.response.status === 401) {
            SpotifyAPI.signOut()
          }
        }
      }
    }

    return result
  }
}
