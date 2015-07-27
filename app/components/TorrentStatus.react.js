import React from 'react'
import connectToStores from 'alt/utils/connectToStores'

import TorrentStore from '../stores/TorrentStore'
import TorrentActions from '../actions/TorrentActions'
import TorrentStates from '../constants/TorrentStates'

@connectToStores
export default class TorrentStatus extends React.Component {
  static getStores(props) {
    return [TorrentStore]
  }

  static getPropsFromStores(props) {
    return TorrentStore.getState()
  }

  getStatusLabel(status) {
    switch (status) {
      case TorrentStates.LoadingMeta:
        return "Loading metadata ..."
      case TorrentStates.Ready:
        return "Ready"
      case TorrentStates.Downloading:
        return "Downloading ..."
      default:
        return "Unknown"
    }
  }

  render() {
    const status = this.getStatusLabel(this.props.state)

    return (
      <div className="torrent-status">
        <div className="row">
          <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1">
            <button id="back" type="button" className="btn btn-default" aria-label="Left Align" onClick={this._onClick}>
              <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
              </button>
          </div>
          <div className="status">
            {status}
          </div>
        </div>
      </div>
    )
  }

  _onClick() {
    console.log("close torrent")
    TorrentActions.closeTorrent()
  }
}
