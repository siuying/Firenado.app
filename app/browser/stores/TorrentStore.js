import alt from '../alt'
import peerflix from 'peerflix'
import numeral from 'numeral'
import address from 'network-address'
import ipc from 'ipc'
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
      store.videoUrl = videoUrl
      store.openVideo(videoUrl)
      store.emitChange()
      console.log('listening on ', videoUrl)
    });
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

  onSelectFile(file) {
    this.selectedFile = file
  }

  onCloseTorrent() {
    this.reset()
  }

  openVideo(videoUrl) {
    console.log("Play Video:", videoUrl)
    ipc.send('open-video', videoUrl)
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
      engine.remove(() => {
        console.log("cleanup torrent-stream completed.")
      })
      engine = null
    }
  }
}

export default alt.createStore(TorrentStore, 'TorrentStore')
