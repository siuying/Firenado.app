import React from 'react'
import connectToStores from 'alt/utils/connectToStores'

import Searcher from './Searcher.react'
import TorrentItemList from './TorrentItemList.react'
import TorrentStatus from './TorrentStatus.react'
import TorrentFileList from './TorrentFileList.react'

import TorrentStore from '../stores/TorrentStore'
import TorrentStates from '../constants/TorrentStates'

@connectToStores
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

    if (this.props.state == TorrentStates.LoadingMeta || this.props.state == TorrentStates.Ready) {
      return this.renderTorrentInfo()
    }

    console.log('unknown state', this.props.state)
    return null
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
        <TorrentFileList />
      </div>
    )
  }
}

export default PrivatePlayApp
