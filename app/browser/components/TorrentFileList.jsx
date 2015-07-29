import React from 'react'
import connectToStores from 'alt/utils/connectToStores'

import TorrentFileItem from './TorrentFileItem'
import TorrentStore from '../stores/TorrentStore'

class TorrentFileList extends React.Component {
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
      <div className="dropdown">
        <button className="btn btn-default dropdown-toggle"
        type="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="true">
          {this.props.selectedFile.name}
          <span className="caret"></span>
        </button>
        <ul className="dropdown-menu"
          aria-labelledby="dropdownMenu1">
          {files}
        </ul>
      </div>
    )
  }
}

export default TorrentFileList = connectToStores(TorrentFileList)
