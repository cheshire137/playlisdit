import LocalStorage from './LocalStorage'

export default class SpotifyProfile {
  static save(profile) {
    const { images, id, country } = profile
    const imageUrl = images && images.length > 0 ? images[0].url : null

    LocalStorage.set('spotifyProfile', { id, country, imageUrl })
  }

  static load() {
    return LocalStorage.get('spotifyProfile')
  }
}
