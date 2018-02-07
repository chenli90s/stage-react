import React from 'react'
import { Route,Redirect } from 'react-router-dom'

import Home from '../views/home/index'
import {List} from '../views/list/index'

export default () => [
  <Route path='/' render={()=><Redirect to='/home'/>} exact/>,
  <Route path='/home' component={Home}  />,
  <Route path='/list/:number' component={List} />,
]
