import React from 'react'
import connectToStores from 'alt/utils/connectToStores'

import TorrentFileItem from './TorrentFileItem.react'
import TorrentStore from '../stores/TorrentStore'

@connectToStores
export default class TorrentFileList extends React.Component {
  static getStores(props) {
    return [TorrentStore]
  }

  static getPropsFromStores(props) {
    const state = TorrentStore.getState()
    return {
      files: state.files,
      selectedFile: state.selectedFile
    }
  }

  render() {
    if (!this.props.files) {
      return null
    }

    var files = this.props.files.map((f) => {
      return (<TorrentFileItem
        key={f.path}
        file={f}
        selected={this.props.selectedFile == f} />)
    })
    return (
      <div className="list-group torrent-files">
        {files}
      </div>
    )
  }
}
