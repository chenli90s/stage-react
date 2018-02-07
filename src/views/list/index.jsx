import React from 'react'

export class List extends React.Component{
  constructor(){
    super()
  }

  render(){

    return (<div> this is list 123 param: {this.props.match.params.number}</div>)
  }
}
