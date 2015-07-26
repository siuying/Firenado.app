import alt from '../alt'

class SearchStore {
  constructor() {
    this.state = {
      query: null
    }
  }
}

export default alt.createStore(SearchStore, 'SearchStore')