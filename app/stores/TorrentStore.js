import alt from '../alt'
import TorrentActions from '../actions/TorrentActions'
import keyMirror from 'keyMirror'

const STATES = keyMirror({
  Idle: null,
  LoadingMeta: null,
  Ready: null,
  Downloading: null,
  Finished: null
})

class TorrentStore {
  constructor() {
    this.bindActions(TorrentActions)

    this.torrentUrl = null
    this.state = STATES.Idle
  }

  onOpenTorrentUrl(url) {
    console.log('open torrent url', url)
    this.torrentUrl = url
    this.state = STATES.LoadingMeta
  }
}

export default alt.createStore(TorrentStore, 'TorrentStore')
