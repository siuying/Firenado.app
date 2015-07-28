import React from 'react'
import connectToStores from 'alt/utils/connectToStores'
import wjs from "wcjs-player"

import TorrentStore from '../stores/TorrentStore'
import TorrentActions from '../actions/TorrentActions'
import TorrentStates from '../constants/TorrentStates'

import TorrentFileList from './TorrentFileList.react'

@connectToStores
export default class TorrentStatus extends React.Component {
  static getStores(props) {
    return [TorrentStore]
  }

  static getPropsFromStores(props) {
    return TorrentStore.getState()
  }

  componentDidMount() {
    this.player = new wjs("#player").addPlayer({ autoplay: true })
  }

  componentWillUnmount() {
    this.player.stop()
    this.player = null
  }

  render() {
    var statusView = (this.props.state == TorrentStates.LoadingMetadata) ? this.renderStatusView()  : null
    var fileListView = (this.props.state != TorrentStates.LoadingMetadata) ? this.renderFileListView() : null

    return (
      <div className="torrent-status">
        <div className="header">
          <button id="back"
            type="button"
            className="btn btn-default form-group"
            aria-label="Left Align"
            onClick={this._onClick}>
            <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
          </button>
          {statusView}
          {fileListView}
        </div>
        <div id="player" className="embed-responsive embed-responsive-16by9">
        </div>
      </div>
    )
  }

  renderStatusView() {
    return (<div className="status"><label>Loading metadata ...</label></div>)
  }

  renderFileListView() {
    return (<div className="file-list"><TorrentFileList /></div>)
  }

  _onClick() {
    console.log("close torrent")
    TorrentActions.closeTorrent()
  }
}
