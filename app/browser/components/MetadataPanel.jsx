import React from 'react'
import connectToStores from 'alt/utils/connectToStores'
import MetadataStore from '../stores/MetadataStore'

@connectToStores
export default class MetadataPanel extends React.Component {
  static getStores(props) {
    return [MetadataStore]
  }

  static getPropsFromStores(props) {
    return MetadataStore.getState()
  }

  render() {
    if (!this.props.type) {
      return null
    }

    var overview = this.props.overview ? this.props.overview : "Loading ..."

    return (
      <div className="panel panel-default metadata">
        <div className="panel-heading">{this.props.name}</div>
        <div className="panel-body">
          <p>{overview}</p>
        </div>
      </div>
    )
  }
}
