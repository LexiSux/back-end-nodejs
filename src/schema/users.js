let m =  require('mongoose')
let Schema = m.Schema
let sch = new m.Schema({
    username:String,
    password:String,
    name:String,
    email:{type:String, default:''},
    level:Number,
    phone:{type:String, default:''},
    createdBy:{type: Schema.Types.ObjectId, autopopulate:{ select: 'username name email phone' }, ref:'user'},
},
{
    timestamps: true,
})
sch.plugin(require('mongoose-autopopulate'))

module.exports = m.model('user',sch);