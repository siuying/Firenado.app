import alt from '../alt'
import MovieDB from 'moviedb'
import TVDB from 'node-tvdb'

import TorrentStore from './TorrentStore'
import TorrentActions from '../actions/TorrentActions'

const MovieNameWithYearRegexp = /^(.+)((19|20)[0-9]{2})/
const TvNameRegexp = /^(.+)(S|s)([0-9]{1,2})(E|e)([0-9]{1,2})/

try {
  // check if the api key file is defined
  var APIKeys = require('../constants/ApiKeys')
} catch (e) {
  // use default api key
  alert("Please copy ./app/browser/constant/APIKeys.detault.js to ./app/browser/constant/APIKeys.js and set all services API keys!")
  throw "Please copy ./app/browser/constant/APIKeys.detault.js to ./app/browser/constant/APIKeys.js and set all services API keys!"
}

class MetadataStore {
  constructor() {
    this.bindActions(TorrentActions)
  }

  onSelectFile(file) {
    this.filename = file.name
    this.parseFilename(file.name)

    // get movie metadata
    if (this.type == 'movie') {
      console.log("search themoviedb")
      this.fetchMovieData(this.name, this.year)
    }

    if (this.type == 'tv') {
      console.log("search tvdb")
      this.fetchTvData(this.name)
    }
  }

  onCloseTorrent() {
    this.type = null
    this.name = null
    this.season = null
    this.episode = null
    this.imdb_id = null
    this.name = null
    this.overview = null
    this.poster_path = null
    this.backdrop_path = null

  }

  parseFilename(filename) {
    this.type = 'unknown'
    this.name = filename

    const tvMatch = filename.match(TvNameRegexp)
    if (tvMatch) {
      this.type = 'tv'
      this.name = tvMatch[1].replace(/[\(\)]/g, "").replace(/\./g, " ").trim()
      this.season = tvMatch[3] ? Number(tvMatch[3]) : null
      this.episode = tvMatch[5] ? Number(tvMatch[5]) : null
      return
    }

    const movieMatch = filename.match(MovieNameWithYearRegexp)
    if (movieMatch) {
      this.name = movieMatch[1].replace(/[\(\)]/g, "").replace(/\./g, " ").trim()
      var year = movieMatch[2]
      if (year) {
        this.year = Number(year)
      }
      this.type = 'movie'
      return
    }
  }

  fetchMovieData(name, year) {
    var movieDB = MovieDB(APIKeys.MovieDB)
    movieDB.searchMovie({query: name, year: year}, (error, response) => {
      if (response && response.results && response.results.length > 0) {
        var movieResult = response.results[0]
        movieDB.movieInfo({id: movieResult.id}, (error, movie) => {
          if (error) {
            console.log("error fetching movie", error)
            return
          }

          console.log("movie", movie)
          this.imdb_id = movie.imdb_id
          this.name = movie.title
          this.overview = movie.overview
          if (movie.poster_path) {
            this.poster_path = `https://image.tmdb.org/t/p/w396${movie.poster_path}`
          }
          if (movie.backdrop_path) {
            this.backdrop_path = `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
          }
          this.emitChange()
        })
      } else {
        console.log("no result!", error);
      }
    })
  }

  fetchTvData(name) {
    var tvdb = new TVDB(APIKeys.TVDB)
    tvdb.getSeriesByName(name, (error, results) => {
      if (error) {
        console.error("error fetching tv data", error)
        return
      }

      console.log("results", results)
      if (results && results.length > 0) {
        var show = results[0]
        console.log("show", show)

        this.imdb_id = show.IMDB_ID
        this.name = show.SeriesName
        this.overview = show.Overview
        if (show.banner) {
          this.backdrop_path = `http://thetvdb.com/banners/${show.banner}`
        }
        this.emitChange()
      }
    })
  }
}

export default alt.createStore(MetadataStore, 'MetadataStore')
