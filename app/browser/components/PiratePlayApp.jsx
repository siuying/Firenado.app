import React from 'react'
import connectToStores from 'alt/utils/connectToStores'

import Searcher from './Searcher'
import TorrentItemList from './TorrentItemList'
import TorrentStatus from './TorrentStatus'

import TorrentStore from '../stores/TorrentStore'
import TorrentStates from '../constants/TorrentStates'

class PrivatePlayApp extends React.Component {
  static getStores(props) {
    return [TorrentStore]
  }

  static getPropsFromStores(props) {
    const state = TorrentStore.getState()
    return {
      state: state.state
    }
  }

  render(){
    if (this.props.state == TorrentStates.Idle) {
      return this.renderSearch()
    }

    return this.renderTorrentInfo()
  }

  renderSearch() {
    return (
      <div id="container">
        <Searcher />
        <TorrentItemList />
      </div>
    )
  }

  renderTorrentInfo() {
    return (
      <div id="container">
        <TorrentStatus />
      </div>
    )
  }
}

export default PrivatePlayApp = connectToStores(PrivatePlayApp)
