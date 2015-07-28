import React from 'react'

export default class TorrentFile extends React.Component {
  render() {
    var highlightClass = this.props.selected ? "list-group-item list-group-item-success" : "list-group-item"
    return (
      <a href="#"
        className={highlightClass}
        onClick={this._onClick.bind(this)}
        >
        {this.props.file.name}
      </a>
    )
  }

  _onClick(e) {
    console.log('item: ', this.props.file)
  }
}
