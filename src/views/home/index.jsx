import React from 'react'

import {
  observer,
  inject,
} from 'mobx-react'

@inject('appStage') @observer
export default class Home extends React.Component{

  constructor(){
    super()
    this.changeName = this.changeName.bind(this)
  }


  changeName(e){
    this.props.appStage.changeName(e.target.value)
  }

  render(){
    return (

      <div>
        <input type="text" onChange={this.changeName}></input>
        {this.props.appStage.msg}</div>
    )
  }
}

