import React from 'react'

import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import 'bulma/css/bulma.css'
import './style.scss'

import Map1 from './components/map'
import Input from './components/Input'




class App extends React.Component {



  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Input} />
          <Route path="/map/:latitude/:longitude" component={Map1} />
        </Switch>
      </BrowserRouter>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
