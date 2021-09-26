//this Models Name
var model_name = "Slots"
var autoInc = require('mongoose-auto-increment')

var {validator} = require('validator')
module.exports = function(mongoose, models, config, logger){
    logger.info("Loading "+model_name+" model...");
    autoInc.initialize(mongoose.connection);
    const Schema = mongoose.Schema;    
    let _model = new Schema(
    {
        
        date:{ type: Number, ref: 'Dates' },
        slot: {type: Number, required: true, default: 0},
        location:{ type: Number, ref: 'Locations' }, 
        available_nurses: {type: Number, required: true, default: 1},
        patients:[{ type: Number, ref: 'Patients' }]
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
            ret.capacity = ret.available_nurses * config.NURSE_RATIO;
            ret.available = ret.capacity - ret.patients.length;
            ret.slots_taken =  ret.patients.length;
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

