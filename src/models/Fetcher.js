export default class Fetcher {
  static checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response
    }
    const error = new Error(response.statusText)
    error.response = response
    throw error
  }

  static parseJson(response) {
    return response.json()
  }

  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  get(path, headers) {
    return this.makeRequest('GET', path, headers)
  }

  post(path, headers, body) {
    return this.makeRequest('POST', path, headers, body)
  }

  put(path, headers, body) {
    return this.makeRequest('PUT', path, headers, body)
  }

  delete(path, headers, body) {
    return this.makeRequest('DELETE', path, headers, body)
  }

  makeRequest(method, path, headers, body) {
    const url = `${this.baseUrl}${path}`
    const data = { method, headers }
    if (body) {
      data.body = JSON.stringify(body)
    }
    return fetch(url, data).then(Fetcher.checkStatus)
                           .then(Fetcher.parseJson)
  }
}
