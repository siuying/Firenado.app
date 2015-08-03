import alt from '../alt'
import subtitler from 'subtitler'
import tmp from 'tmp'
import fs from 'fs'
import path from 'path'

import SubtitleActions from '../actions/SubtitleActions'
import TorrentActions from '../actions/TorrentActions'

const SupportedFormats = ["srt", "vtt", "sub"]

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
  }

  onSelectSubtitleById(id) {
    this.selectedSubtitle = this.subtitles.find((sub) => sub.id == id)
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
        // SubDownloadLink is a .gz file URL,
        // Add extension so that wcjs-player will decode it
        var urlWithFormat = sub.SubDownloadLink.replace(/\.gz$/, '.' + sub.SubFormat)
        return {
          id: sub.IDSubtitleFile,
          name: sub.SubFileName,
          format: sub.SubFormat,
          language: sub.LanguageName,
          downloads: Number(sub.SubDownloadsCnt),
          url:  urlWithFormat
        }
      }).filter((sub) => SupportedFormats.indexOf(sub.format) > -1)

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
}

export default alt.createStore(SubtitleStore, 'SubtitleStore')
