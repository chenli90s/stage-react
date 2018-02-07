import {
  observable,
  computed,
  autorun,
  action,
} from 'mobx'


class AppState{
  @observable count = 0
  @observable name = 'haha'

  @computed get msg(){
    return `${this.name} is ${this.count}`
  }
  @action add(){
    this.count += 1
  }
  @action changeName(name){
    this.name = name
  }

}



const appState = new AppState()

setInterval(()=>{
  appState.add()
}, 1000)

autorun(()=>{
  console.log(appState.msg)
})



export default appState
