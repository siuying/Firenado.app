var GUI = _require('nw.gui')
GUI.Window.get().showDevTools()

import React from 'react'
import PiratePlayApp from './components/PiratePlayApp.react'

React.render(
  <PiratePlayApp />,
  document.getElementById('react')
)
