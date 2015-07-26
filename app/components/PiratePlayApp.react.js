import connectToStores from 'alt/utils/connectToStores'
import React from 'react'

import SearchStore from '../stores/SearchStore'
import Searcher from './Searcher.react'
import TorrentItemList from './TorrentItemList.react'

@connectToStores
class PrivatePlayApp extends React.Component {
  static getStores() {
    return [SearchStore]
  }

  static getPropsFromStores() {
    return SearchStore.getState()
  }

  render() {
    return (
      <div className="container">
        <Searcher />
        <TorrentItemList />
      </div>
    )
  }
}

export default PrivatePlayApp