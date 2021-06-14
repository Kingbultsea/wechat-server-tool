const app = require('express')()
const convert = require('../dist/api/index')

module.exports = convert(app)
