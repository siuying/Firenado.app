import connectToStores from 'alt/utils/connectToStores';
import { Component } from 'react'
import SearchStore from '../stores/SearchStore'

@connectToStores
class PrivatePlayApp extends Component {
  static getStores() {
    return [SearchStore];
  }

  static getPropsFromStores() {
    return {};
  }

  render() {
    return (
      <h1>Hi!</h1>
    )
  }
}
