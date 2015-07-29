import alt from '../alt'
import peerflix from 'peerflix'
import numeral from 'numeral'
import address from 'network-address'
import ipc from 'ipc'
import process from 'process'

import TorrentActions from '../actions/TorrentActions'
import TorrentStates from '../constants/TorrentStates'

var engine = null
var engineRemoveListener = null

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
    this.state = TorrentStates.LoadingMetadata

    if (/^magnet:/.test(url)) {
      this.onTorrent(url)
    } else {
      console.warn("unsupported url: ", url)
    }
  }

  onTorrent(torrent) {
    engine = peerflix(torrent)

    var store = this
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
    engine.server.on('listening', () => {
      var host = address()
      var videoUrl = `http://${host}:${engine.server.address().port}/`
      store.state = TorrentStates.Listening
      store.videoUrl = videoUrl
      store.openVideo(store.selectedFile.name, store.videoUrl)
      store.emitChange()
    });
    function onready() {
      store.files = engine.files
      store.selectedFile = engine.server.index
      store.state = TorrentStates.Ready
      store.emitChange()
    }
    if (engine.torrent) {
      onready()
    } else {
      engine.on('ready', onready)
    }

    // setup a remove callback on exit
    var engineRemoveListener = function () {
      engine.remove(function () {
        console.log("cleanup completed.")
        process.exit()
      })
    }
    process.on('SIGINT', engineRemoveListener)
    process.on('SIGTERM', engineRemoveListener)
  }

  onSelectFile(file) {
    this.selectedFile = file
  }

  onCloseTorrent() {
    this.reset()
  }

  openVideo(title, url) {
    ipc.send('open-video', title, url)
  }

  reset() {
    this.state = TorrentStates.Idle
    this.torrentUrl = null
    this.videoUrl = null
    this.files = null
    this.selectedFile = null
    this.hotswaps = 0
    this.verified = 0
    this.invalid = 0

    if (engine) {
      // cleanup the abort listener
      if (engineRemoveListener) {
        process.removeListener('SIGINT', engineRemoveListener)
        process.removeListener('SIGTERM', engineRemoveListener)
        engineRemoveListener = null
      }

      // cleanup and destroy the engine
      var engineToRemove = engine
      engineToRemove.remove(() => {
        engineToRemove.destroy(() => {
        })
      })
      engine = null;
    }
  }
}

export default alt.createStore(TorrentStore, 'TorrentStore')
