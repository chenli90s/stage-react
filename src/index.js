import ReactDom from 'react-dom'
import React from 'react'
import {AppContainer} from 'react-hot-loader'
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'mobx-react'

import appStage from './store/app-store'
import App from './App.jsx'

const ele_root = document.getElementById('root')

const render = Component => {
  ReactDom.hydrate(
    <AppContainer>
      <Provider appStage={appStage}>
        <BrowserRouter>
          <Component/>
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    ele_root
  )
}


render(App)

if (module.hot) {
  module.hot.accept('./App.jsx', () => {
    const NextApp = require('./App.jsx')
    render(NextApp)
  })
}
