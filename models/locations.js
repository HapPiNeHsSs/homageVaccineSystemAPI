//this Models Name
var model_name = "Locations"
var autoInc = require('mongoose-auto-increment')

var {validator} = require('validator')
module.exports = function(mongoose, models, config, logger){
    logger.info("Loading "+model_name+" model...");
    autoInc.initialize(mongoose.connection)
    const Schema = mongoose.Schema;    
    let _model = new Schema(
    {
        dates:[{ type: Number, ref: 'Dates' }], //must be of type Dates. See usage https://mongoosejs.com/docs/populate.html,},
        slots:[{ type:Number, ref: 'Slots' }],
        location_name:{ type: String, required: true, unique:true},
    },
    {   
        timestamps: true,
    });
    // Duplicate the ID field.
    _model.virtual('id').get(function(){
        return this._id;
    });

    // Ensure virtual fields are serialised.
    _model.set('toJSON', {
        getters: true, 
        virtuals: true,
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;}
        ,
    });

    
    _model.plugin(require('mongoose-bcrypt'));
    _model.plugin(autoInc.plugin, model_name);
    //Add your Schema custom methods or statics here//
    //reference: https://mongoosejs.com/docs/guide.html#methods//
    _model.static('print_hi', function() {
        console.log("hi")
    });
    //End of Schema methods//
   

    models[model_name]=mongoose.model(model_name, _model);
}


