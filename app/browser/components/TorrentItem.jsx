import React from 'react'

import SearchStore from '../stores/SearchStore'
import TorrentActions from '../actions/TorrentActions'
import moment from 'moment'

export default class TorrentItem extends React.Component {
  render() {
    return (
      <tr className="item" onClick={this._onClick.bind(this)}>
        <td className="category">
          {this.props.category}
        </td>
        <td className="main">
          <span className="name">{this.props.name}</span> <br/>
          <span className="caption">
            <span className="size">{this.props.size}</span>
          </span>
        </td>
        <td className="seeders">{this.props.seeders}</td>
        <td className="leechers">{this.props.leechers}</td>
      </tr>
    )
  }

  _onClick(e) {
    console.log("selected torrent magnet: ", this.props.link)
    TorrentActions.openTorrentUrl(this.props.link)
  }
}
