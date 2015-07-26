import connectToStores from 'alt/utils/connectToStores'
import React from 'react'
import SearchStore from '../stores/SearchStore'

@connectToStores
class Searcher extends React.Component {
  static getStores() {
    return [SearchStore]
  }

  static getPropsFromStores() {
    return SearchStore.getState()
  }

  render() {
    return (
      <div className="container">
        <div className="input-group">
          <input type="text" className="form-control" placeholder="TV shows or Movies" aria-describedby="basic-addon2"></input>
          <span className="input-group-addon" id="basic-addon2">Go</span>
        </div>
      </div>
    )
  }
}

export default Searcher