import alt from '../alt'
import subtitler from 'subtitler'
import request from 'request'
import tmp from 'tmp'
import fs from 'fs'
import path from 'path'
import zlib from 'zlib'

import SubtitleActions from '../actions/SubtitleActions'
import TorrentActions from '../actions/TorrentActions'

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
    tmp.setGracefulCleanup()
  }

  onCloseTorrent() {
    this.subtitles = null
    this.loading = false
    this.selectedSubtitle = null

    if (this.downloadedSubtitlePath) {
      fs.unlinkSync(this.downloadedSubtitlePath)
      this.downloadedSubtitlePath = null
    }
  }

  onSelectSubtitleById(id) {
    this.selectedSubtitle = this.subtitles.find((sub) => sub.id == id)

    if (this.downloadedSubtitlePath) {
      fs.unlinkSync(this.downloadedSubtitlePath)
      this.downloadedSubtitlePath = null
    }
    this.downloadSubtitle(this.selectedSubtitle.downloadUrl)
  }

  onSearch(query) {
    if (query.imdb_id) {
      this.loading = true

      if (query.season && query.episode) {
        this.performSearch({imdbid: String(query.imdb_id), query: query.name, seasion: query.season, episode: query.episode, sublanguageid: this.languages})
      } else {
        this.performSearch({imdbid: String(query.imdb_id), query: query.name, sublanguageid: this.languages})
      }
      return
    }

    if (query.name) {
      console.log("search with name: ", query.name)
      this.loading = true
      this.performSearch({query: query.name, sublanguageid: this.languages})
      return
    }

    console.log("unknown query", query)
  }

  // perform the search using subtitler
  performSearch(query) {
    console.log("perform search ...", query)

    var handleSearchResult = function() {
      this.loading = false
      this.subtitles = results.map((sub) => {
        return {
          id: sub.IDSubtitleFile,
          name: sub.SubFileName,
          format: sub.SubFormat,
          language: sub.LanguageName,
          downloads: Number(sub.SubDownloadsCnt),
          downloadUrl: sub.SubDownloadLink // .gz sub file download
        }
      })
      if (results.length > 0) {
        this.selectedSubtitle = this.subtitles[0]
        SubtitleActions.selectSubtitleById(this.selectedSubtitle.id)
      }

      console.log("found subtitles", this.subtitles)
      this.emitChange()
    }

    return this.subtitler
      .then(() => subtitler.api.search(this.token, "eng", query))
      .then(handleSearchResult.bind(this))
  }

  // download subtitle and save it to disk (as temp file),
  // then update this.downloadedSubtitlePath
  downloadSubtitle(url) {
    console.log("selected subtitle", this.selectedSubtitle)

    var postfix = `.${this.selectedSubtitle.format}`
    tmp.file({prefix: 'subtitle', postfix: postfix}, (error, path, fd) => {
      if (error) {
        console.error("failed open file to write subtitle", error)
        return
      }

      console.log(`downloaded subtitle: ${path}`)
      var outStream = fs.createWriteStream(path)
      request({uri: url})
        .pipe(zlib.createGunzip())
        .pipe(outStream)
        .on('finish', (result) => {
          fs.close(fd, (error) => {
            console.log("written subtitle: " + path)
            this.downloadedSubtitlePath = path
            this.emitChange()
          })
        })
    })
  }
}

export default alt.createStore(SubtitleStore, 'SubtitleStore')
