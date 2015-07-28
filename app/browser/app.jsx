var polyfill = require("babel/polyfill");

import React from 'react'
import PiratePlayApp from './components/PiratePlayApp'

React.render(
  <PiratePlayApp />,
  document.getElementById('react')
)
