import React from 'react'
import { Link } from 'React-router-dom'
import Routers from './router/index'

export default class App extends React.Component{
    render(){
        return [
          <div key='div'>
            <Link to='home' key='home'>首页</Link>
            <br/>
            <Link to='/list/1' key='list'>列表</Link>
          </div>,
          <Routers />,
        ]

    }
}
