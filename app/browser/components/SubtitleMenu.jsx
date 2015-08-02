import React from 'react'
import connectToStores from 'alt/utils/connectToStores'

import TorrentFileItem from './TorrentFileItem'
import SubtitleStore from '../stores/SubtitleStore'
import SubtitleActions from '../actions/SubtitleActions'

@connectToStores
export default class SubtitleMenu extends React.Component {
  static getStores(props) {
    return [SubtitleStore]
  }

  static getPropsFromStores(props) {
    return SubtitleStore.getState()
  }

  render() {
    if (!this.props.subtitles) {
      return null
    }

    if (this.props.loading) {
      return this.renderLoading()
    }

    var subtitleItems = this.props.subtitles
      .filter((sub) => sub.name)
      .map((sub) => this.renderSubtitleItem(sub))
    var selectedName = this.props.selectedSubtitle ? this.props.selectedSubtitle.name : ""

    return (
      <div className="dropdown subtitles">
        <button className="btn btn-default dropdown-toggle"
        type="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="true">
          {selectedName}
          <span className="caret"></span>
        </button>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
          {subtitleItems}
        </ul>
      </div>
    )
  }

  renderSubtitleItem(subtitle) {
    return (
      <li key={subtitle.id}>
        <a href="#" onClick={this._onClickItem} data-selected-id={subtitle.id}>
          {subtitle.name}
        </a>
      </li>
    )
  }

  renderLoading() {
    return (
      <div className="dropdown subtitles">
        <button className="btn btn-default dropdown-toggle"
        type="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="true">
          Loading ...
        </button>
      </div>
    )
  }

  _onClickItem(e) {
    var id = e.currentTarget.getAttribute('data-selected-id')
    SubtitleActions.selectSubtitleById(id)
  }
}
