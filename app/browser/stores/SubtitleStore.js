import alt from '../alt'
import subtitler from 'subtitler'
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

    this.subtitles = null
    this.loading = false
    this.languages = 'eng'

    subtitler.api.login().then((token) => {
      console.log("token", token)
      this.token = token
    })
  }

  performSearch(query) {
    if (!this.token) {
      throw "not logged in"
    }
    return subtitler.api.search(this.token, "eng", query)
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
      console.log("search with imdb id: ", query.imdb_id, "token", this.token)
      this.loading = true

      if (query.season && query.episode) {
        this.performSearch({imdbid: String(query.imdb_id), query: query.name, seasion: query.season, episode: query.episode, sublanguageid: this.languages}).then(this.handleSubtitle.bind(this))
      } else {
        this.performSearch({imdbid: String(query.imdb_id), query: query.name, sublanguageid: this.languages}).then(this.handleSubtitle.bind(this))
      }
      return
    }

    if (query.name) {
      console.log("search with name: ", query.name)
      this.loading = true
      this.performSearch({query: query.name, sublanguageid: this.languages}).then(this.handleSubtitle.bind(this))
      return
    }

    console.log("unknown query", query)
  }

  onLogout() {
    subtitler.api.logout()
    console.log("logged out opensubtitle")
  }

  handleSubtitle(results) {
    this.loading = false
    this.subtitles = transformSubtitles(results)
    if (results.length > 0) {
      this.selectedSubtitle = this.subtitles[0]
    }
    console.log("results", this.subtitles)
    this.emitChange()
  }
}

export default alt.createStore(SubtitleStore, 'SubtitleStore')
