import alt from '../alt'
import peerflix from 'peerflix'
import numeral from 'numeral'

import TorrentActions from '../actions/TorrentActions'
import TorrentStates from '../constants/TorrentStates'

var engine = null
var toBytes = function (num) {
  return numeral(num).format('0.0b')
}

class TorrentStore {
  constructor() {
    this.bindActions(TorrentActions)
    this.reset()
  }

  onOpenTorrentUrl(url) {
    console.log('open torrent url', url)

    this.torrentUrl = url
    this.state = TorrentStates.LoadingMeta

    if (/^magnet:/.test(url)) {
      this.onTorrent(url)
    } else {
      console.warn("unsupported url: ", url)
    }
  }

  onTorrent(torrent) {
    engine = peerflix(torrent)

    var store = this
    var hotswaps = 0
    var verified = 0
    var invalid = 0

    engine.on('hotswap', () => {
      store.hotswaps++
      store.emitChange()
    })
    engine.on('verify', () => {
      store.verified++
      store.emitChange()
    })
    engine.on('invalid-piece', () => {
      store.invalid++
      store.emitChange()
    })

    function onready() {
      store.files = engine.files
      store.selectedFile = engine.server.index
      store.state = TorrentStates.Ready
      store.emitChange()
      console.log(store.files.map((file) => file.name))
    }

    if (engine.torrent) {
      onready()
    } else {
      engine.on('ready', onready)
    }
  }

  onCloseTorrent() {
    this.reset()
  }

  reset() {
    this.state = TorrentStates.Idle
    this.torrentUrl = null
    this.files = null
    this.selectedFile = null
    this.hotswaps = 0
    this.verified = 0
    this.invalid = 0

    if (engine) {
      engine.remove(() => {
        engine = null
      })
    }
  }
}

export default alt.createStore(TorrentStore, 'TorrentStore')
