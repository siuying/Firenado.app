import React from 'react'
import SearchActions from '../actions/SearchActions'

export default class SearchEngineListItem extends React.Component {
  render() {
    var highlightClass = this.props.selected ? "list-group-item list-group-item-success" : "list-group-item"
    return (
      <li>
        <a href="#"
          onClick={this._onClick.bind(this)}
          >
          {this.props.name}
        </a>
      </li>
    )
  }

  _onClick(e) {
    SearchActions.setEngine(this.props.code)
  }
}
