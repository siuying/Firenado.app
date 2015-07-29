import connectToStores from 'alt/utils/connectToStores'
import React from 'react'

import SearchStore from '../stores/SearchStore'
import SearchActions from '../actions/SearchActions'

class Searcher extends React.Component {
  static getStores(props) {
    return [SearchStore]
  }

  static getPropsFromStores(props) {
    const state = SearchStore.getState()
    return {
      query: state.query,
      enabled: !state.searching
    }
  }

  render() {
    const enabled = this.props.enabled
    // if user changed the query, use the changed value, otherwsie use props
    const query = this.state ? this.state.query : this.props.query
    return (
      <div className="searcher row">
        <form
          className="form-inline searcher"
          onSubmit={this._onSubmit.bind(this)}>
          <div className="form-group">
            <input type="text"
              className="form-control"
              placeholder="TV shows or Movies"
              onChange={this._onInputChanged.bind(this)}
              disabled={!enabled}
              aria-describedby="basic-addon2"
              value={query}/>
          </div>
          <button type="submit"
            disabled={!enabled}
            className="btn btn-default">Go</button>
        </form>
      </div>
    )
  }

  _onSubmit(e) {
    SearchActions.search(this.state.query)
    e.preventDefault()
  }

  _onInputChanged(e) {
    this.setState({query: e.target.value})
  }
}

export default Searcher = connectToStores(Searcher)
