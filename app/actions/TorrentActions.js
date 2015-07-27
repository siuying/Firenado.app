import alt from '../alt'

class TorrentActions {
  constructor() {
    this.generateActions(
      'openTorrentUrl'
    )
  }
}

export default alt.createActions(TorrentActions)
