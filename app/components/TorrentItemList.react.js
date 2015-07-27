import connectToStores from 'alt/utils/connectToStores'
import React from 'react'

import SearchStore from '../stores/SearchStore'
import SearchActions from '../actions/SearchActions'
import TorrentItem from './TorrentItem.react'

function getTorrentItem(torrent) {
  return (<TorrentItem key={torrent.link}
    name={torrent.name} 
    category={torrent.category}
    subcategory={torrent.subcategory}
    uploadDate={torrent.uploadDate}
    size={torrent.size}
    seeders={torrent.seeders}
    leechers={torrent.leechers} />)
}

@connectToStores
export default class TorrentItemList extends React.Component {
  static getStores(props) {
    return [SearchStore]
  }

  static getPropsFromStores(props) {
    const state = SearchStore.getState()
    return {
      torrents: state.torrents
    }
  }

  render() {
    if (!this.props.torrents) {
      return null
    }

    const items = this.props.torrents.map(getTorrentItem)
    return (
      <table className="table table-hover torrents">
        <thead>
          <tr>
            <td>Type</td>
            <td>Name</td>
            <td>SE</td>
            <td>LE</td>
          </tr>
        </thead>
        <tbody>
          {items}
        </tbody>
      </table>
    )
  }
}