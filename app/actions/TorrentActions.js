import alt from '../alt'

class TorrentActions {
  constructor() {
    this.generateActions(
      'openTorrentUrl',
      'closeTorrent',
      'selectFile'
    )
  }
}

export default alt.createActions(TorrentActions)
