import connectToStores from 'alt/utils/connectToStores'
import React from 'react'
import SearchStore from '../stores/SearchStore'

@connectToStores
class PrivatePlayApp extends React.Component {
  static getStores() {
    return [SearchStore]
  }

  static getPropsFromStores() {
    return SearchStore.getState()
  }

  render() {
    return (
      <div>
        <h1>Hi {this.props.user}</h1>
      </div>
    )
  }
}

export default PrivatePlayApp