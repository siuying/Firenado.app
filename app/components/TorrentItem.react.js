import React from 'react'

import SearchStore from '../stores/SearchStore'
import TorrentActions from '../actions/TorrentActions'
import moment from 'moment'

// the date formate is either MM-DD hh:mm OR MM-DD YYYY
function formatDisplayString(dateString) {
  if (!dateString) {
    return ""
  }
  var parsedDate;
  if (dateString.indexOf(":") > -1) {
    parsedDate = moment(dateString, "MM-DD hh:mm")
  } else {
    parsedDate = moment(dateString, "MM-DD YYYY")
  }

  if (!parsedDate) {
    console.warn("parsedDate is empty?", dateString)
    return "N/A"
  }
  return parsedDate.fromNow();
}

export default class TorrentItem extends React.Component {
  render() {
    const uploadDate = formatDisplayString(this.props.uploadDate)
    return (
      <tr className="item" onClick={this._onClick.bind(this)}>
        <td className="category">
          {this.props.category.name}<br/>
          ({this.props.subcategory.name})
        </td>
        <td className="main">
          <span className="name">{this.props.name}</span> <br/>
          <span className="caption">
            <span className="date">{uploadDate}</span>
            <span className="size">{this.props.size}</span>
          </span>
        </td>
        <td className="seeders">{this.props.seeders}</td>
        <td className="leechers">{this.props.leechers}</td>
      </tr>
    )
  }

  _onClick(e) {
    console.log("selected torrent magnet: ", this.props.magnetLink)
    TorrentActions.openTorrentUrl(this.props.magnetLink)
  }
}
