import connectToStores from 'alt/utils/connectToStores'
import React from 'react'

import SearchStore from '../stores/SearchStore'
import SearchActions from '../actions/SearchActions'

@connectToStores
export default class Searcher extends React.Component {
  static getStores(props) {
    return [SearchStore]
  }

  static getPropsFromStores(props) {
    const state = SearchStore.getState()
    console.log('getPropsFromStores', state)
    return {
      query: state.query,
      enabled: !state.searching
    }
  }

  render() {
    console.log('render', this.props)
    const enabled = this.props.enabled
    const query = this.props.query
    return (
      <div className="row">
        <form 
          className="form-inline searcher"
          onSubmit={this._onSubmit.bind(this)}>
          <div className="form-group col-xs-10 col-sm-11 col-md-11 col-lg-11">
            <input type="text" 
              className="form-control"
              placeholder="TV shows or Movies"
              onChange={this._inputChanged.bind(this)}
              disabled={!enabled}
              aria-describedby="basic-addon2">
              {query}
            </input>
          </div>
          <button type="submit" 
            disabled={!enabled}
            className="btn btn-default col-xs-2 col-sm-1 col-md-1 col-lg-1">Go</button>
        </form>
      </div>
    )
  }

  _onSubmit(e) {
    SearchActions.search(this.state.query)
    e.preventDefault()
  }

  _inputChanged(e) {
    this.setState({query: e.target.value})
  }
}