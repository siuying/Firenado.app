import connectToStores from 'alt/utils/connectToStores'
import React from 'react'
import SearchStore from '../stores/SearchStore'

@connectToStores
export default class Searcher extends React.Component {
  static getStores() {
    return [SearchStore]
  }

  static getPropsFromStores() {
    return SearchStore.getState()
  }

  constructor(props) {
    super(props)
    this.state = {query: ""}
  }

  submitSearch(e) {
    console.log("submit search", this.state)
  }

  inputChanged(e) {
    this.setState({query: e.target.value})
  }

  submitSearch(e) {
    console.log(`submit search ${this.state.query}`)
  }

  render() {
    return (
      <div className="searcher input-group">
        <input type="text" 
          className="form-control"
          placeholder="TV shows or Movies"
          onChange={this.inputChanged.bind(this)}
          aria-describedby="basic-addon2">
          {this.state.query}
        </input>
        <span className="input-group-addon" 
          id="basic-addon2"
          onClick={this.submitSearch.bind(this)}>Go</span>
      </div>
    )
  }
}