import alt from '../alt'

class WindowActions {
  constructor() {
    this.generateActions(
      'openMainWindow',
      'openVideoWindow'
    )
  }
}

export default alt.createActions(WindowActions)
