import LocalStorage from './LocalStorage'

const profileKey = 'spotifyProfile'

export default class SpotifyProfile {
  static save(profile) {
    const { images, id, country } = profile
    const imageUrl = images && images.length > 0 ? images[0].url : null

    LocalStorage.set(profileKey, { id, country, imageUrl })
  }

  static load() {
    return LocalStorage.get(profileKey)
  }

  static delete() {
    LocalStorage.delete(profileKey)
  }
}
