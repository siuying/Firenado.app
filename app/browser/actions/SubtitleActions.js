import alt from '../alt'

class SubtitleActions {
  constructor() {
    this.generateActions(
      'search',
      'selectSubtitleById',
      'download'
    )
  }
}

export default alt.createActions(SubtitleActions)
