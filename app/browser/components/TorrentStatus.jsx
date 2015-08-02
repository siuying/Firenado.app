import React from 'react'
import connectToStores from 'alt/utils/connectToStores'
import wjs from "wcjs-player"

import TorrentStore from '../stores/TorrentStore'
import SubtitleStore from '../stores/SubtitleStore'

import TorrentActions from '../actions/TorrentActions'
import TorrentStates from '../constants/TorrentStates'

import TorrentFileList from './TorrentFileList'
import MetadataPanel from './MetadataPanel'
import SubtitleMenu from './SubtitleMenu'

@connectToStores
export default class TorrentStatus extends React.Component {
  static getStores(props) {
    return [TorrentStore]
  }

  static getPropsFromStores(props) {
    return TorrentStore.getState()
  }

  render() {
    var statusView = (this.props.state == TorrentStates.LoadingMetadata) ? this.renderStatusView()  : null
    var fileListView = (this.props.state != TorrentStates.LoadingMetadata) ? this.renderFileListView() : null
    var playButton = (this.props.state != TorrentStates.LoadingMetadata) ? this.renderPlayButton() : null

    return (
      <div className="torrent-status">
        <div className="header">
          <button id="back"
            type="button"
            className="btn btn-default form-group"
            aria-label="Left Align"
            onClick={this._onClickBack}>
            <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
          </button>
          {statusView}
          {fileListView}
          {playButton}
        </div>

        <MetadataPanel />
        <SubtitleMenu />
      </div>
    )
  }

  renderStatusView() {
    return (<div className="status"><label>Loading metadata ...</label></div>)
  }

  renderFileListView() {
    return (<div className="file-list"><TorrentFileList /></div>)
  }

  renderPlayButton() {
    return (
      <button type="button"
        className="btn btn-default form-group"
        aria-label="Left Align"
        onClick={this._onClickPlay}>
        <span className="glyphicon glyphicon-play" aria-hidden="true"></span>
      </button>
    )
  }

  _onClickBack() {
    console.log("close torrent")
    TorrentActions.closeTorrent()
  }

  _onClickPlay() {
    console.log("play torrent")
    TorrentActions.playTorrent()
  }
}
