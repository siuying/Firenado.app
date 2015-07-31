import alt from '../alt'
import SearchActions from '../actions/SearchActions'

import TorrentFinder from 'torrent-finder'

class SearchStore {
  constructor() {
    this.bindActions(SearchActions)

    this.engines = [
      new TorrentFinder.Piratebay(),
      new TorrentFinder.Dmhy(),
      new TorrentFinder.Popgo(),
      new TorrentFinder.Nyaa()
    ]
    this.onSetEngine("piratebay")

    this.query = null
    this.searching = false
    this.torrents = null
  }

  onSearch(query) {
    this.query = query
    this.searching = true
    console.log("Search", query, this.searching)

    var store = this
    // category 200 = video
    this.searcher.search(query).then((torrents) => {
      console.log(torrents)
      store.searching = false
      store.torrents = torrents
      store.emitChange()

    }).catch((error) => {
      console.log(error)
      store.searching = false
      store.emitChange()

    })
  }

  onSetEngine(engineCode) {
    this.selectedEngineName = engineCode
    this.searcher = this.engines.find((e) => e.name() == engineCode)
  }
}

export default alt.createStore(SearchStore, 'SearchStore')
