## webpack配置
   
   - 安装包
   ```
    webpack
    
    react
    
    react-dom
   ```
   
   - 配置项
   ```js
   const path = require('path')

    module.exports = {
        entry: {
            app: path.join(__dirname, '../src/index.js')
        },
        output:{
            filename: '[name].[hash].js',
            path: path.json(__dirname, '../dist'),
            publicPath: '/public',
        }
        
    }
   ```
   
   - webpack需要的loader
   ```
   babel-loader
   ```
   - babel所依赖的包
   ```
   balel-core
   
   babel-preset-es2015
   
   babel-preset-es2015-loose
   
   babel-preset-react
   ```
   
  - 创建`.babelrc`, 编辑
   
       ```json
       {
          "presets": [
            ["es2015", {"loose": true}],
            "react"
          ]
        }
       ```
   
  - 在webpack配置中加入
   
       ```
        
        const path = require('path')
    
        module.exports = {
        entry: {
            app: path.join(__dirname, '../src/index.js')
        },
        output: {
            filename: '[name].[hash].js',
            path: path.join(__dirname, '../dist'),
            publicPath: '/public',
        },
        module: {
            rules: [{
                test: /.js$|.jsx$/,
                loader: 'babel-loader',
                exclude: path.join(__dirname, '../node_modules'),
            },
            ]
        }
        } 
       ```
    
  - 安装 html-webpack-pulgin
    
    ```
    //帮我们把js打包文件注入到html文件
    const path = require('path')
    const HTMLPlugin = require('html-webpack-plugin')
    
    module.exports = {
        entry: {
            app: path.join(__dirname, '../src/index.js')
        },
        output: {
            filename: '[name].[hash].js',
            path: path.join(__dirname, '../dist'),
            publicPath: '/public',
        },
        module: {
            rules: [{
                test: /.js/,
                loader: 'babel-loader',
                exclude: path.join(__dirname, '../node_modules'),
            },
                {
                    test: /.jsx/,
                    loader: 'babel-loader',
                }
            ]
        },
        plugins: [
            new HTMLPlugin()
        ]
    }
    ````
## 服务端渲染
    
 重新创建webpack配置
    
   ```
    const path = require('path')
    // const HTMLPlugin = require('html-webpack-plugin')

    module.exports = {
        target: "node", //指定运行环境
        entry: {
            app: path.join(__dirname, '../src/server-entry.js')
        },
        output: {
            filename: 'server-entry.js',
            path: path.join(__dirname, '../dist'),
            // publicPath: '/public',
            libraryTarget: "commonjs2" //使用commonjs模块规范
        },
        module: {
            rules: [{
                test: /.js/,
                loader: 'babel-loader',
                exclude: path.join(__dirname, '../node_modules'),
            },
                {
                    test: /.jsx/,
                    loader: 'babel-loader',
                }
            ]
        },
        // plugins: [
        //     new HTMLPlugin()
        // ]
    }
   ```

   - 配置npm 命令
  
     - 安装 rimraf 删除文件的包

        ```
        "scripts": {
        "dev": "webpack --config ./build/webpack.config.js",
        "dev:server": "webpack --config ./build/webpack.config.server.js",
        "clear": "rimraf dist",
        "build": "npm run clear && npm run dev && npm run dev:server"
        },
        ```
   
   
    - 创建express 服务
    
        - 安装express

        - 创建 server.js 运行express服务

            ```
            
                const express = require('express')
                const path = require('path')
                const ReactSSR = require('react-dom/server')
                const fs = require('fs')
                const server_entry = require('../dist/server-entry').default

                const html_template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8')

                const app = express()

                app.use('/public', express.static(path.join(__dirname, '../dist')))

                app.get('*', function (req, res) {
                    const appString = ReactSSR.renderToString(server_entry)
                    const html = html_template.replace('<!--content-->', appString)
                    res.send(html)
                })

                app.listen(8000, function () {
                    console.log('server is linstening on 8000')
                })
            ```
## webpack-dev-server 配置

   - 安装webpack-dev-server

   - 配置webpack.config.js

```
    const path = require('path')
    const HTMLPlugin = require('html-webpack-plugin')

    const isDev= process.env.NODE_ENV == 'development'

    const config = {
        entry: {
            app: path.join(__dirname, '../src/index.js')
        },
        output: {
            filename: '[name].[hash].js',
            path: path.join(__dirname, '../dist'),
            publicPath: '/public',
        },
        module: {
            rules: [{
                test: /.js/,
                loader: 'babel-loader',
                exclude: path.join(__dirname, '../node_modules'),
            },
                {
                    test: /.jsx/,
                    loader: 'babel-loader',
                }
            ]
        },
        plugins: [
            new HTMLPlugin({
                template: path.join(__dirname, '../src/index.html')
            })
        ]
    }


    if (isDev){
        config.devServer = {
            host: '0.0.0.0',
            port: '8580',
            contentBase: path.join(__dirname, '../dist'),
            hot: true, 
            overlay: {  //显示错误提示
                errors: true 
            },
            publicPath: '/public',
            historyApiFallback: {
            index: '/public/index.html'
            }    
        }
    }


    module.exports = config
```
- 配置启动命令

    - 安装 cross-env 保证操作系统统一
    ```
    "scripts": {
    "dev:client": "webpack --config ./build/webpack.config.js",
    "dev:server": "webpack --config ./build/webpack.config.server.js",
    "dev": "cross-env NODE_ENV=development webpack-dev-server --config ./build/webpack.config.js",
    "clear": "rimraf dist",
    "build": "npm run clear && npm run dev && npm run dev:server",
    "start": "node ./server/server.js"
    },
    ```
## 添加react-hot-loader

   安装 react-hot-loader

   配置.babelrc
   ```
   {
    "presets": [
        ["es2015", {"loose": true}],
        "react"
    ],
    "plugins": ["react-hot-loader/babel"]
    }
   ```
    
   - 入口文件index.js 中修改
    
```
    import ReactDom from 'react-dom'
    import React from 'react'
    import { AppContainer } from 'react-hot-loader'
    import App from './App.jsx'

    const ele_root = document.getElementById('root')

    const render = Component => {
        ReactDom.hydrate(
        <Component />,
        ele_root
    )
    }


    render(App)

    if (module.hot){
        module.hot.accept('./App.jsx', ()=>{
            render(App)
        })
    }
```

   - 在webpack中添加

   ```
   const path = require('path')
    const webpack = require('webpack')
    const HTMLPlugin = require('html-webpack-plugin')

    const isDev= process.env.NODE_ENV == 'development'

    const config = {
        entry: {
            app: path.join(__dirname, '../src/index.js')
        },
        output: {
            filename: '[name].[hash].js',
            path: path.join(__dirname, '../dist'),
            publicPath: '/public/',
        },
        module: {
            rules: [{
                test: /.js/,
                loader: 'babel-loader',
                exclude: path.join(__dirname, '../node_modules'),
            },
                {
                    test: /.jsx/,
                    loader: 'babel-loader',
                }
            ]
        },
        plugins: [
            new HTMLPlugin({
                template: path.join(__dirname, '../src/index.html')
            })
        ]
    }


    if (isDev){
        // 热启动的入口文件
        config.entry = {
            // 启动热启动的编译加载器
            app: ['react-hot-loader/patch',
                path.join(__dirname, '../src/index.js')]
        } 
        config.devServer = {
            host: '0.0.0.0',
            port: '8580',
            contentBase: path.join(__dirname, '../dist'),
            hot: true,
            overlay: {  //显示错误提示
                errors: true
            },
            publicPath: '/public',
            historyApiFallback: {
                index: '/public/index.html'
            },
        }
        // 加入webpack的热启动插件
        config.plugins.push(new webpack.HotModuleReplacementPlugin())
    }


    module.exports = config
```

## eslint和editconfig配置

   - 安装 eslint

     ```
     eslint
     babel-eslint
     eslint-config-airbnb
     eslint-config-standard
     eslint-loader
     eslint-plugin-import
     eslint-plugin-jsx-a11y
     eslint-plugin-node
     eslint-plugin-promise
     eslint-plugin-react
     eslint-plugin-standard
     ```
     创建 .eslintrc 文件
     ```
     {
        "parser": "babel-eslint",
        "env": {
            "browser": true,
            "es6": true,
            "node": true
        },
        "parserOptions": {
            "ecmaVersion": 6,
            "sourceType": "module"
        },
        "extends": "airbnb",
        "rules": {
            "semi": [0]
        }
        }   
        ```

   - webpack 中加入 eslint-loader

   - editorconfig 配置

   在根目录创建 .editorconfig

   ```
   root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
```

 - husky git提交的钩子

    安装 husky

    配置 lint 命令
    ```
    "lint": "eslint --ext .jsx --ext .js src/"
    ```

## webpack-merge 和 nodemon

 ### webpack-merge合并webpack配置重复代码
    安装
 ### nodemon 监视文件变动就重启。
安装

根目录下创建 nodemon.json 配置文件， 只会监听node的js文件
    
    ```
        {
        "restartable": "rs", //是否重启
        "ignore": [ //忽略的文件夹
            ".git",
            "node_modules/**/node_modules",
            ".eslintrc",
            "src",
            "build"
        ],
        "env": {
            "NODE_ENV": "development"
        },
        "verbose": true, //显示错误信息
        "ext": "js" //监视js文件变动
        }
    ```
## react-router

  安装react-router, react-router-dom

  webpack 导包后缀配置

  ```
    resolve: {
        extensions: ['.js', '.jsx']
    },
  ```
  react-router 组件化
  ```
    import React from 'react'
    import { Route,Redirect } from 'react-router-dom'

    import Home from '../views/home/index'
    import {List} from '../views/list/index'

    export default () => [
    <Route path='/' render={()=><Redirect to='/home'/>} exact/>,
    <Route path='/home' component={Home}  />,
    <Route path='/list' component={List} />,
    ]
  ```

  页面应用

  ```
    import React from 'react'
    import { Link } from 'React-router-dom'
    import Routers from './router/index'

    export default class App extends React.Component{
        render(){
            return [
            <div key='div'>
                <Link to='home' key='home'>首页</Link>
                <br/>
                <Link to='list' key='list'>列表</Link>
            </div>,
            <Routers />,
            ]

        }
    }
  ```

  渲染的时候必须包裹AppContainer

  ```
    import ReactDom from 'react-dom'
    import React from 'react'
    import {AppContainer} from 'react-hot-loader'
    import {BrowserRouter} from 'react-router-dom'

    import App from './App.jsx'

    const ele_root = document.getElementById('root')

    const render = Component => {
    ReactDom.hydrate(
        <AppContainer>
        <BrowserRouter>
            <Component/>
        </BrowserRouter>
        </AppContainer>,
        ele_root
    )
    } 
  ```
 ### mobx使用

  配置 .babelrc 

  ```
    {
    "presets": [
        ["es2015", {"loose": true}],
        "stage-1",
        "react"
    ],
    "plugins": ["transform-decorators-legacy", "react-hot-loader/babel"]
    }
  ```

  安装 ：
   
   `mobx`

   `mobx-react`

   `babel-preset-stage-1`

   `babel-plugin-transform-decorators-legacy`

 mobx的创建应用 appState
 ```
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
   ```

  - 在index.js中加入 Provider

    ```js
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
    ```

   在Homo组件中添加监视， 注入状态appStage

   ```js
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
   ```




