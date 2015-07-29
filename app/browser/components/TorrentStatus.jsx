import React from 'react'
import connectToStores from 'alt/utils/connectToStores'
import wjs from "wcjs-player"

import TorrentStore from '../stores/TorrentStore'
import TorrentActions from '../actions/TorrentActions'
import TorrentStates from '../constants/TorrentStates'

import TorrentFileList from './TorrentFileList'

class TorrentStatus extends React.Component {
  static getStores(props) {
    return [TorrentStore]
  }

  static getPropsFromStores(props) {
    return TorrentStore.getState()
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.stop()
      this.player = null
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.videoUrl) {
      if (!this.state || this.state.videoUrl !=  nextProps.videoUrl) {
        this.player = new wjs("#player").addPlayer({ autoplay: true })
        this.player.addPlaylist(nextProps.videoUrl)
        console.log('set video url:', nextProps.videoUrl)
      }
    } else {
      if (this.player) {
        this.player.stop()
      }
    }
    this.setState(nextProps)
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

export default TorrentStatus = connectToStores(TorrentStatus)
