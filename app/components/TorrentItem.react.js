import React from 'react'

import SearchStore from '../stores/SearchStore'
import SearchActions from '../actions/SearchActions'
import moment from 'moment'

// return a relative date from today, based on input MM-DD hh:mm format.
// based on assumption that fromDate string is MM-DD hh:mm, and it could only be past date
function formatDisplayString(dateString) {
  var parsedDate = moment(dateString, "MM-DD hh:mm")
  if (parsedDate.toDate() > new Date()) {
    parsedDate.substract(1, 'years');
  }
  return parsedDate.fromNow();
}

export default class TorrentItem extends React.Component {
  render() {
    const uploadDate = formatDisplayString(this.props.uploadDate)
    return (
      <tr className="item">
        <td className="category">
          {this.props.category.name}<br/>
          ({this.props.subcategory.name})
        </td>
        <td className="main">
          <span className="name">{this.props.name}</span> <br/>
          <span className="date">{uploadDate}</span>
        </td>
        <td className="seeders">{this.props.seeders}</td>
        <td className="leechers">{this.props.leechers}</td>
      </tr>
    )
  }
}