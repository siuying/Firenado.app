import alt from '../alt'

class SearchStore {
  constructor() {
    this.state = {user: 'siuying'}
  }
}

export default alt.createStore(SearchStore, 'SearchStore')