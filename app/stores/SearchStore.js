import alt from '../alt'

class SearchStore {
  constructor() {
    this.bindListeners({})
    this.state = {}
  }
}

export default alt.createStore(SearchStore, 'SearchStore')
