import React from 'react'
import connectToStores from 'alt/utils/connectToStores'

import SearchStore from '../stores/SearchStore'
import SearchActions from '../actions/SearchActions'
import SearchEngineListItem from './SearchEngineListItem'

const SearchEngineNames = {
  "piratebay": "Pirate Bay",
  "dmhy": "動漫花園",
  "popgo": "POPGO",
  "nyaa": "Nyaa"
}

function getEngineName(engineCode) {
  return SearchEngineNames[engineCode]
}

function getSearchEngineItem(engine) {
  var code = engine.name()
  return (<SearchEngineListItem
    key={code}
    code={code}
    name={getEngineName(code)} />)
}

class SearchEngineList extends React.Component {
  static getStores(props) {
    return [SearchStore]
  }

  static getPropsFromStores(props) {
    const state = SearchStore.getState()
    return {
      engines: state.engines,
      selectedEngineName: state.selectedEngineName
    }
  }

  render() {
    if (!this.props.engines) {
      return null
    }

    var selectedEngineName = this.props.selectedEngineName
    var enginesItems = this.props.engines.map((f) => getSearchEngineItem(f))
    console.log("selectedEngineName:", selectedEngineName, "engines:", this.props.engines)
    return (
      <div className="dropdown engines">
        <button className="btn btn-default dropdown-toggle"
        type="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="true">
          {getEngineName(selectedEngineName)}
          <span className="caret"></span>
        </button>
        <ul className="dropdown-menu"
          aria-labelledby="dropdownMenu1">
          {enginesItems}
        </ul>
      </div>
    )
  }
}

export default SearchEngineList = connectToStores(SearchEngineList)
