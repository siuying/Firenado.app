import alt from '../alt'

class TorrentActions {
  constructor() {
    this.generateActions(
      'openTorrentUrl',
      'closeTorrent'
    )
  }
}

export default alt.createActions(TorrentActions)
