import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import PlaylistView from './components/PlaylistView'
import SpotifyLogin from './components/SpotifyLogin'
import SpotifyAPI from './models/SpotifyAPI'
import 'bulma/css/bulma.css'
import './App.css'

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    SpotifyAPI.isAuthenticated() ? (
      <Component {...props} />
    ) : (
      <Redirect to={{
        pathname: '/',
        state: { from: props.location }
      }} />
    )
  )}/>
)

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={SpotifyLogin} />
          <PrivateRoute exact path="/playlist/top/:time" component={PlaylistView} />
          <PrivateRoute exact path="/playlist/:section" component={PlaylistView} />
          <PrivateRoute exact path="/playlist" component={PlaylistView} />
        </div>
      </Router>
    )
  }
}

export default App
