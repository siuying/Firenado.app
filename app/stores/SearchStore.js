import alt from '../alt'
import SearchActions from '../actions/SearchActions'

import thepiratebay from 'thepiratebay'
thepiratebay.setUrl('https://thepiratebay.la')

class SearchStore {
  constructor() {
    this.bindActions(SearchActions)

    this.query = null
    this.searching = false
    this.results = null
  }

  onSearch(query) {
    this.query = query
    this.searching = true
    console.log("Search", query, this.searching)

    // category 200 = video
    thepiratebay.search(query, {category: 200}).then((results) => {
      console.log(results)
      this.searching = false
      this.results = results
      this.emitChange()

    }).catch((error) => {
      console.log(error)
      this.searching = false
      this.results = null
      this.emitChange()

    })
  }
}

export default alt.createStore(SearchStore, 'SearchStore')