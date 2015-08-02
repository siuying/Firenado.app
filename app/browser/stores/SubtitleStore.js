import alt from '../alt'
import subtitler from 'subtitler'
import request from 'request'
import temp from 'temp'
import fs from 'fs'

import SubtitleActions from '../actions/SubtitleActions'
import TorrentActions from '../actions/TorrentActions'

function transformSubtitles(subitles) {
  return subitles.map((sub) => {
    return {
      id: sub.IDSubtitleFile,
      name: sub.SubFileName,
      downloads: Number(sub.SubDownloadsCnt),
      downloadUrl: sub.SubDownloadLink // .gz sub file download
    }
  })
}

class SubtitleStore {
  constructor() {
    this.bindActions(SubtitleActions)
    this.bindActions(TorrentActions)

    this.languages = 'eng'
    this.subtitles = null
    this.loading = false
    this.downloadedSubtitlePath = null

    // login with opensubtitler
    this.subtitler = subtitler.api.login().then((token) => {
      console.log("opensubtitle token", token)
      this.token = token
    })

    // keep track of temp file
    temp.track()
  }

  onCloseTorrent() {
    this.subtitles = null
    this.loading = false
    this.selectedSubtitle = null

    // cleanup temp file
    if (this.downloadedSubtitlePath) {
      temp.cleanupSync()
      this.downloadedSubtitlePath = null
    }

    // logout opensubtitle
    if (this.token) {
      subtitler.api.logout(this.token)
      this.subtitler = null
      this.token = null
    }
  }

  onSelectSubtitleById(id) {
    this.selectedSubtitle = this.subtitles.find((sub) => sub.id == id)
  }

  onSearch(query) {
    if (query.imdb_id) {
      this.loading = true

      if (query.season && query.episode) {
        this.performSearch({imdbid: String(query.imdb_id), query: query.name, seasion: query.season, episode: query.episode, sublanguageid: this.languages})
          .then(this.onDownloadedSubtitle.bind(this))
      } else {
        this.performSearch({imdbid: String(query.imdb_id), query: query.name, sublanguageid: this.languages})
          .then(this.onDownloadedSubtitle.bind(this))
      }
      return
    }

    if (query.name) {
      console.log("search with name: ", query.name)
      this.loading = true
      this.performSearch({query: query.name, sublanguageid: this.languages})
        .then(this.onDownloadedSubtitle.bind(this))
      return
    }

    console.log("unknown query", query)
  }

  onLogout() {
    if (this.token) {
      subtitler.api.logout(this.token)
      this.subtitler = null
      this.token = null
    }
    console.log("logged out opensubtitle")
  }

  // perform the search using subtitler
  performSearch(query) {
    console.log("perform search ...", query)
    return this.subtitler.then(() => subtitler.api.search(this.token, "eng", query))
  }

  // download subtitle and save it to disk (as temp file),
  // then update this.downloadedSubtitlePath
  downloadSubtitle(url) {
    request({uri: url, gzip: true}, (error, response, body) => {
      if (error) {
        console.log("failed download subtitle file", url, error)
        return
      }

      temp.open('filename', (error, info) => {
        if (error) {
          console.error("failed open file to write subtitle", error)
          return
        }

        fs.write(info.fd, body, (error) => {
          if (error) {
            console.error("failed writing subtitle", error, "path:", info.path)
            return
          }

          fs.close(info.fd, (error) => {
            if (error) {
              console.error("failed closing subtitle file", error, "path:", info.path)
              return
            }
            console.log("temp subtitle path", info.path)
            this.downloadedSubtitlePath = info.path
          })
        })
      })
    })
  }

  onDownloadedSubtitle(results) {
    this.loading = false
    this.subtitles = transformSubtitles(results)
    if (results.length > 0) {
      this.selectedSubtitle = this.subtitles[0]
    }
    console.log("found subtitles", this.subtitles)
    this.emitChange()
  }
}

export default alt.createStore(SubtitleStore, 'SubtitleStore')
