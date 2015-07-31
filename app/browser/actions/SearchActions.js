import alt from '../alt'

class SearchActions {
  constructor() {
    this.generateActions(
      'search',
      'setEngine'
    )
  }
}

export default alt.createActions(SearchActions)
