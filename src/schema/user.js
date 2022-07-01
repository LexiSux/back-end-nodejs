let m = require('mongoose')
let Schema = m.Schema
let sch = new m.Schema({
    nama: String,
    umur: String,
    alamat: String
})
sch.index({ nama: 1 }, { unique: true });
sch.plugin(require('mongoose-autopopulate'));

module.exports = m.model('users', sch);