import alt from '../alt'
import SearchActions from '../actions/SearchActions'

import thepiratebay from 'thepiratebay'
thepiratebay.setUrl('https://thepiratebay.la')

class SearchStore {
  constructor() {
    this.bindActions(SearchActions)

    this.query = null
    this.searching = false
    this.torrents = null
  }

  onSearch(query) {
    this.query = query
    this.searching = true
    console.log("Search", query, this.searching)

    // category 200 = video
    thepiratebay.search(query, {category: 200}).then((torrents) => {
      // torrents: category{id, name}, leechers, link, magnetLink, name, 
      // seeders, size, subcategory{id, name}, torrentLink, uploadDate
      console.log(torrents)
      this.searching = false
      this.torrents = torrents
      this.emitChange()

    }).catch((error) => {
      console.log(error)
      this.searching = false
      this.emitChange()

    })
  }
}

export default alt.createStore(SearchStore, 'SearchStore')