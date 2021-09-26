var moment = require('moment');
var path = "/api"

const updateDotenv = require('update-dotenv')
 

module.exports = function (app, models, passport, jwt, connectEnsureLogin, config, logger) {

  app.get(path+"/update_ratio", async(req, res, next) =>  {
    if (req.query.ratio===undefined) return res.json({ "error": "Parameter ratio is required" });
    updateDotenv({
      NURSE_RATIO: req.query.ratio
    }).then((newEnv) => {
      return res.json({ "Success": "Ratio Updated", ratio: req.query.ratio });
    })

  });


  app.post(path+"/register", async(req, res, next) =>  {

    if (req.body.location_id===undefined) return res.json({ "error": "Parameter location_id is required" });
    if (!req.body.date) return res.json({ "error": "Parameter date is required" });
    if (req.body.slot===undefined) return res.json({ "error": "Parameter slot is required" });
    if (req.body.patient_name===undefined) return res.json({ "error": "Parameter patient_name is required" });
    if (req.body.patient_email===undefined) return res.json({ "error": "Parameter patient_email is required" });

    if(req.body.slot<0 || req.body.slot>23) return res.json({"error": "Slot format is hours from 0-23"});

    //check if this Location is present
    var location = await models.Locations.findOne({_id: req.body.location_id}).exec()
    if (location === null) {
      return res.json({ "error": "Location ID not Found" });
    }

    //check if this Date is present
    if (req.body.date) {
      _date = moment(req.body.date,"DD MM YYYY");
      if(!_date.isValid()) return res.json({"error": "date format is dd/mm/yyyy"});

    }else return res.json({ "error": "Parameter date is required" });

    
    var date_doc = await models.Dates.findOne({date: _date, location: location._id}).exec()
    if (date_doc === null) {
      return res.json({ "error": "Date not Found" });
    }

    //check if this Slot is present
    var slot = await models.Slots.findOne({date: date_doc._id, location: location._id, slot: req.body.slot}).exec()
    if (slot === null) {
      return res.json({ "error": "Slot not Found" });
    }
    if(slot.patients.length >= (slot.available_nurses*config.NURSE_RATIO) ){
      return res.json({ "error": "Slot is Full, Please choose a different slot" });
    }

    //check if patient has already registered before and return details
    var patient = await models.Patients
      .findOne({patient_email: req.body.patient_email})
      .populate({
        path : 'slot',
        populate : [
          {path : 'date'},
          {path : 'location'}]
        })
      .exec()
    if (patient) {
      logger.info(patient.slot.date)
      return res.json({ "error": "Patient is already registered",
        "location_id": patient.slot.location._id,
        "location_name": patient.slot.location.location_name,
        "date": moment(patient.slot.date.date).format("DD/MM/YYYY"), 
        "slot": patient.slot.slot,
        "patient_name": patient.patient_name,
        "patient_email": patient.patient_email});
    }
    
    patient = new models.Patients({
      patient_name: req.body.patient_name,
      patient_email: req.body.patient_email,
      slot: slot._id
    })
    await patient.save()

    slot.patients.push(patient)
    await slot.save()
    return res.json({ "success": "Patient registered",
        "location_id": location._id,
        "location_name": location.name,
        "date": date_doc.date, 
        "slot": slot.slot,
        "patient_name": patient.patient_name,
        "patient_email": patient.patient_email});
  });

  app.put(path+"/update_schedule", async(req, res, next) =>  {

    if (req.body.location_id===undefined) return res.json({ "error": "Parameter location_id is required" });
    if (!req.body.date) return res.json({ "error": "Parameter date is required" });
    if (req.body.slot===undefined) return res.json({ "error": "Parameter slot is required" });
    if (req.body.patient_email===undefined) return res.json({ "error": "Parameter patient_email is required" });
    if(req.body.slot<0 || req.body.slot>23) return res.json({"error": "Slot format is hours from 0-23"});
    //check if this Location is present
    var location = await models.Locations.findOne({_id: req.body.location_id}).exec()
    if (location === null) {
      return res.json({ "error": "Location ID not Found" });
    }

    //check if this Date is present
    if (req.body.date) {
      _date = moment(req.body.date,"DD MM YYYY");
      if(!_date.isValid()) return res.json({"error": "date format is dd/mm/yyyy"});

    }else return res.json({ "error": "Parameter date is required" });

    
    var date_doc = await models.Dates.findOne({date: _date, location: location._id}).exec()
    if (date_doc === null) {
      return res.json({ "error": "Date not Found" });
    }

    //check if this Slot is present
    var slot = await models.Slots.findOne({date: date_doc._id, location: location._id, slot: req.body.slot}).exec()
    if (slot === null) {
      return res.json({ "error": "Slot not Found" });
    }
    if(slot.patients.length >= (slot.available_nurses*config.NURSE_RATIO) ){
      return res.json({ "error": "Slot is Full, Please choose a different slot" });
    }

    //check if patient has already registered before and return details
    var patient = await models.Patients
      .findOne({patient_email: req.body.patient_email})
      .exec()
    if (patient==null) {
      return res.json({ "error": "This patient is not registered, please register the user"});
    }
    if(patient.slot === slot._id) return res.json({ "error": "same slot"});

    models.Slots.update( 
      { "_id" : patient.slot } , 
      { "$pull" : { "patients" : patient._id  } } , 
      { "multi" : true }  
    ).exec()

    patient.slot = slot._id;
    await patient.save()
    slot.patients.push(patient)
    await slot.save()
    return res.json({ "success": "Patient registered",
        "location_id": location._id,
        "location_name": location.name,
        "date": date_doc.date, 
        "slot": slot.slot,
        "patient_name": patient.patient_name,
        "patient_email": patient.patient_email});
  });

  app.post(path+"/create_location", async(req, res, next) =>  {

    if (req.body.location_name===undefined) return res.json({ "error": "Parameter location_name is required" });
    if (!req.body.date_start) return res.json({ "error": "Parameter date_start is required" });
    if (!req.body.date_end) return res.json({ "error": "Parameter date_end is required" });
    if (req.body.available_nurses===undefined) return res.json({ "error": "Parameter available_nurses is required" });
    if(req.body.slot<0 || req.body.slot>23) return res.json({"error": "Slot format is hours from 0-23"});
    date_start = moment(req.body.date_start, "DD MM YYYY");
    date_end = moment(req.body.date_end, "DD MM YYYY");
    
    if(!date_start.isValid() || !date_end.isValid())
    {return res.json({"error": "date format is dd/mm/yyyy"});}
    
    let location = new models.Locations({
      location_name: req.body.location_name
    })
    await location.save()
    .then( async (loc_doc) => {
      for (var d = date_start.toDate(); d <= date_end.toDate(); d.setDate(d.getDate() + 1)) {
        
        let _date = new models.Dates({
          date: d,
          location: loc_doc._id,
        })
        await _date.save()
        .then( async (date_doc) =>  {
          loc_doc.dates.push(_date);
          loc_doc.save();
          for (var i = parseInt(config.START_SLOT); i <= parseInt(config.END_SLOT);  i++) {
            let slot = new models.Slots({
              slot: i,
              location: loc_doc._id,
              date: date_doc._id,
              available_nurses: req.body.available_nurses
            })
            await slot.save()
            .then( async (slot_doc) => {
              date_doc.slots.push(slot_doc);
              await date_doc.save();
              loc_doc.slots.push(slot_doc);
              await loc_doc.save();
            })
            .catch(err => {
              return res.status(500).json({ "error": err });
            })
          }
        })
        .catch(err => {
          return res.status(500).json({ "error": err });
        })
      }
      return res.status(200).json({ "Success": "Location Created" });
    })
    .catch(err => {
      return res.status(500).json({ "error": err });
    })
  });

  app.put(path+"/add_update_date", async(req, res, next) =>  {
    
    if (req.body.location_id===undefined) return res.json({ "error": "Parameter location_id is required" });
    if (req.body.available_nurses===undefined) return res.json({ "error": "Parameter available_nurses is required" });

    if (req.body.date) {
      _date = moment(req.body.date,"DD MM YYYY");
      if(!_date.isValid()) return res.json({"error": "date format is dd/mm/yyyy"});

    }else return res.json({ "error": "Parameter date is required" });
  
        //check if this book is present
    var location = await models.Locations.findOne({_id: req.body.location_id}).lean().exec()
    logger.info(location)
    if (location === null) {
      return res.json({ "error": "Location ID not Found" });
    }


    await models.Dates
      .findOne({ location: req.body.location_id, date: _date })
      .select()
      .exec(function async (err, date_doc) {
        if (!err) {
          if (date_doc === null) {
            let date_doc = new models.Dates({
              date: _date,
              location: req.body.location_id,
            })
            date_doc.save()
            .then( async (date_doc) =>  {
              for (var i = parseInt(config.START_SLOT); i <= parseInt(config.END_SLOT);  i++) {
                let slot = new models.Slots({
                  slot: i,
                  location:req.body.location_id,
                  date: date_doc._id,
                  available_nurses: req.body.available_nurses
                })
                await slot.save()
                .then( slot_doc => {
                  date_doc.slots.push(slot_doc);
                  date_doc.save();
                })
                .catch(err => {
                  return res.status(500).json({ "error": err });
                })
              }
              return res.send({"success":"date created", "location_id": req.body.location_id, "date": req.body.date, "available_nurses": req.body.available_nurses})
            });

          }else{
            models.Slots.updateMany(
              { _id: { $in: date_doc.slots } }, 
              { $set: { available_nurses: req.body.available_nurses } }
            ).exec();
            return res.send({"success":"date updated", "location_id": req.body.location_id, "date": req.body.date, "available_nurses": req.body.available_nurses})
          }
        } else {
          logger.error(err);
          return res.status(500).json({ "error": err });
        }
      })
  });

  app.put(path+"/add_update_slot", async(req, res, next) =>  {
    
    if (req.body.location_id===undefined) return res.json({ "error": "Parameter location_id is required" });
    if (req.body.available_nurses===undefined) return res.json({ "error": "Parameter available_nurses is required" });
    if (req.body.slot===undefined) return res.json({ "error": "Parameter slot is required" });
    if(req.body.slot<0 || req.body.slot>23) return res.json({"error": "Slot format is hours from 0-23"});
    if (req.body.date) {
      _date = moment(req.body.date,"DD MM YYYY");
      if(!_date.isValid()) return res.json({"error": "date format is dd/mm/yyyy"});

    }else return res.json({ "error": "Parameter date is required" });
  
    //check if this Location is present
    var location = await models.Locations.findOne({_id: req.body.location_id}).exec()
    if (location === null) {
      return res.json({ "error": "Location ID not Found" });
    }

    //check if this Date is present
    var date_doc = await models.Dates.findOne({date: _date, location: location._id}).exec()
    if (date_doc === null) {
      return res.json({ "error": "Date not Found" });
    }


    await models.Slots
      .findOne({ location: req.body.location_id, date: date_doc._id, slot: req.body.slot })
      .select()
      .exec()
      .then( async (slot_doc) => {
          logger.info("T"+" "+date_doc._id)
          if (slot_doc === null) {
            let slot_doc = new models.Slots({
              slot: req.body.slot,
              location:req.body.location_id,
              date: date_doc._id,
              available_nurses: req.body.available_nurses
            })
            slot_doc.save()
            .then( slot_doc => {
              date_doc.slots.push(slot_doc);
              date_doc.save();
              return res.send({"success":"Slot created", "location_id": req.body.location_id, slot:slot_doc.slot, "date": req.body.date, "available_nurses": req.body.available_nurses})
            })
            .catch(err => {
              return res.status(500).json({ "error": err });
            })
            
          }
          else{
            slot_doc.available_nurses =  parseInt(req.body.available_nurses);
            await slot_doc.save()
          
            
            await date_doc.slots.push(slot_doc);
            logger.info("here");
            await date_doc.save()
            return res.send({"success":"Slot updated", "location_id": req.body.location_id,  slot:slot_doc.slot, "date": req.body.date, "available_nurses": req.body.available_nurses})
           
            
          }
      })
      // .catch(err => { {
      //     logger.error(err);
      //     return res.status(500).json({ "Errodr": err });
      //   }
      // })

  });

  app.get(path+"/get_locations", async(req, res, next) => {
    // if (req.query.name) {
    //   filter['name'] = new RegExp(`^${req.query.name}$`, 'i')
    // }
    // if (req.query.isbn) {
    //   filter['isbn'] = new RegExp(`^${req.query.isbn}$`, 'i')
    // }
    await models.Locations.find({}).select(["-__v","-dates","-slots"]).exec(function (err, result) {
      if (!err) {
        return res.send(JSON.stringify(result))
      } else {
        logger.error(err);
        return res.status(500).json({ "error": err });
      }
    })

  });


  app.get(path+"/get_dates", async(req, res, next) => {

    filter = {};
    if (!req.query.location_id) return res.json({ "error": "Parameter location_id is required" });

   await models.Locations
      .findOne({ _id: req.query.location_id })
      .select(["-slots"])
      .populate('dates',["-slots"])
      .exec(function (err, result) {
        if (!err) {
          if (result === null) {
            return res.json({ "error": "Location ID not Found" });
          }
          return res.send(JSON.stringify(result))
        } else {
          logger.error(err);
          return res.status(500).json({ "error": err });
        }
      })
  });


app.get(path+"/get_slots", async(req, res, next) => {
  filter = {};
  if (!req.query.location_id) return res.json({ "error": "Parameter location_id is required" });

  if (req.query.date) {
    _date = moment(req.query.date,"DD MM YYYY");
    if(!_date.isValid())
    {return res.json({"error": "date format is dd/mm/yyyy"});}
    filter['date'] = req.query.date;
  }else return res.json({ "error": "Parameter date is required" });

  await models.Dates
    .findOne({ location: req.query.location_id, date: _date })
    .select()
    .populate('slots',["-date","-location"])
    .populate('location',["-dates","-slots"])
    .exec(function (err, result) {
      if (!err) {
        if (result === null) {
          return res.json({ "error": "Location ID or Date not Found" });
        }
        return res.send(JSON.stringify(result))
      } else {
        logger.error(err);
        return res.status(500).json({ "error": err });
      }
    })
  
});


app.delete(path+'/delete_location', async (req, res) => {

  if (req.body.location_id===undefined) return res.json({ "error": "Parameter location_id is required" });


  // if (req.body.date) {
  //   _date = moment(req.body.date,"DD MM YYYY");
  //   if(!_date.isValid()) return res.json({"error": "date format is dd/mm/yyyy"});

  // }else return res.json({ "error": "Parameter date is required" });

      //check if this book is present
  var location = await models.Locations.findOne({_id: req.body.location_id}).lean().exec()
  logger.info(location)
  if (location === null) {
    return res.json({ "error": "Location ID not Found" });
  }

  models.Slots.deleteMany(
    { _id: { $in: location.slots }  }
  ).exec();

  models.Dates.deleteMany(
    { _id: { $in: location.dates }  }
  ).exec();
  
  models.Locations.deleteOne({_id:location._id}).exec();
  
  return res.json({"success":"location deleted, all reservations removed for this location", "location_id": location._id});
})


app.delete(path+'/delete_date', async (req, res) => {

  if (req.body.location_id===undefined) return res.json({ "error": "Parameter location_id is required" });


  if (req.body.date) {
    _date = moment(req.body.date,"DD MM YYYY");
    if(!_date.isValid()) return res.json({"error": "date format is dd/mm/yyyy"});
  }else return res.json({ "error": "Parameter date is required" });

      //check if this book is present
  var location = await models.Locations.findOne({_id: req.body.location_id}).lean().exec()
  if (location === null) {
    return res.json({ "error": "Location ID not Found" });
  }

  var date_doc = await models.Dates.findOne({date: _date, location: location._id}).exec()
  if (date_doc === null) {
    return res.json({ "error": "Date not Found" });
  }

  models.Slots.deleteMany(
    { _id: { $in: date_doc.slots }  }
  ).exec();

  models.Locations.update( 
    { "_id" : location._id } , 
    { "$pull" : { "dates" : date_doc._id  } } , 
    { "multi" : true }  
  ).exec()
  
  models.Dates.deleteOne({_id:date_doc._id}).exec();
  
  return res.json({"success":"Date Deleted, all reservations removed for this location on this date", "location_id": location._id, "date": req.body.date});
})

app.delete(path+'/delete_slot', async (req, res) => {

  if (req.body.location_id===undefined) return res.json({ "error": "Parameter location_id is required" });
  if (req.body.slot===undefined) return res.json({ "error": "Parameter slot is required" });
  if(req.body.slot<0 || req.body.slot>23) return res.json({"error": "Slot format is hours from 0-23"});
  if (req.body.date) {
    _date = moment(req.body.date,"DD MM YYYY");
    if(!_date.isValid()) return res.json({"error": "date format is dd/mm/yyyy"});
  }else return res.json({ "error": "Parameter date is required" });

  var location = await models.Locations.findOne({_id: req.body.location_id}).lean().exec()
  if (location === null) {
    return res.json({ "error": "Location ID not Found" });
  }

  var date_doc = await models.Dates.findOne({date: _date, location: location._id}).exec()
  if (date_doc === null) {
    return res.json({ "error": "Date not Found" });
  }

  var slot = await models.Dates.findOne({date: _date, location: location._id, _id: req.body.slot}).exec()
  if (slot === null) {
    return res.json({ "error": "Slot not Found" });
  }

  models.Patients.updateMany(
    { _id: { $in: slot.patients } }, 
    { $set: { slots:null } }
  ).exec();
  models.Locations.update( 
    { "_id" : location._id } , 
    { "$pull" : { "slots" : slot._id  } } , 
    { "multi" : true }  
  ).exec()

  models.Dates.update( 
    { "_id" : location._id } , 
    { "$pull" : { "slots" : slot._id  } } , 
    { "multi" : true }  
  ).exec()
  
  models.Slots.deleteOne({_id:slot._id}).exec();
  
  return res.json({"success":"Slot Deleted, all reservations removed from this slot for this location on this date", "location_id": location._id, "date": req.body.date});
})

}
