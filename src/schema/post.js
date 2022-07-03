let m =  require('mongoose')
let Schema = m.Schema
let sch = new m.Schema({
    title: String,
    body: String,
    status: String,
    image: String
},
{
    timestamps: true,
})

sch.plugin(require('mongoose-autopopulate'))

module.exports = m.model('post',sch);