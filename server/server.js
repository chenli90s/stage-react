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