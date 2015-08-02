import alt from '../alt'
import peerflix from 'peerflix'
import numeral from 'numeral'
import address from 'network-address'
import remote from 'remote'
import process from 'process'

import TorrentActions from '../actions/TorrentActions'
import TorrentStates from '../constants/TorrentStates'
import SubtitleStore from './SubtitleStore'

var WindowActions = remote.getGlobal('Server').WindowActions
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
      store.emitChange()
    });
    function onready() {
      store.files = engine.files
      store.state = TorrentStates.Ready
      TorrentActions.selectFile(engine.server.index)
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

  onPlayTorrent() {
    var playbackParams = {title: this.selectedFile.name, url: this.videoUrl}

    // set the subtitles if needed
    var subStates = SubtitleStore.getState()
    var subtitlePath = subStates.downloadedSubtitlePath
    var selectedSubtitle = subStates.selectedSubtitle
    if (subtitlePath && selectedSubtitle) {
      var language = selectedSubtitle.language
      playbackParams.subtitles = {}
      playbackParams.subtitles[language] = subtitlePath
    }
    WindowActions.openVideoWindow(playbackParams)
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
      try {
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
      } catch (e) {
        console.warn("catched error on cleanup", e)
      }
      engine = null;
    }
  }
}

export default alt.createStore(TorrentStore, 'TorrentStore')
