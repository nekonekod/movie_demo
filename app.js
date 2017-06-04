/**
 * Created by Nekonekod on 2017/6/4.
 */
var express = require('express')
var app = express()

app.set('view engine','jade')
app.set('port',3000)

app.get('/',function (req, res) {
    res.render('index',{title:'movie demo'})
})

