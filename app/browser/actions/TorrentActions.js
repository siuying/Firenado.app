import alt from '../alt'

class TorrentActions {
  constructor() {
    this.generateActions(
      'openTorrentUrl',
      'closeTorrent',
      'selectFile',
      'playTorrent'
    )
  }
}

export default alt.createActions(TorrentActions)
