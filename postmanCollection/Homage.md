# Project: Homage
## Description: Collection of APIs for simple Out-Patient Reservation system (vaccination system)

Beejay Urzo

## End-point: Create Location
### Description: Create a Location with a date range and default nurses available for those date

Newly created Date slots would have 0800 to 2000 (1 hour per slot) Time slots with default the default number of slots set

Params
- location_name:  Location name
- date_start: (dd/mm/yyyy) date when location can start accept patients
- date_end: (dd/mm/yyyy) date when location will end accepting patients
- available_nurses: number of default nurses
  
Return (JSON)
- Success: {"success":"location created", "location_id": ID, "location_name": LOC_NAME, "date_start": date, "date_end", date, "available_nurses": number}
- Error Duplicate Location: {"error": "duplicate location name"}
- Error Date Format: {"error": "date format is dd/mm/yyyy"}
Method: POST
>```
>{{URI}}/api/create_location
>```
### Body (**raw**)

```json
{"location_name": "tea2e1ddd3s",
"date_start":"20/09/2021",
"date_end":"26/10/2021",
"available_nurses":1}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃


## End-point: Get Locations
### Description: Returns all available locations
  
Return (json)
- Success [{"location_id": ID, "location_name": Name}, ...]
Method: GET
>```
>{{URI}}/api/get_locations
>```
### Body (**raw**)

```json

```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃


## End-point: Get Dates
### Description: Returns all available date for a location

Params
- location_id: Location ID

Return (json)
- Success {"location_id":ID, "location_name": name, "dates":[{"date": date}, ...]}
- Error Location ID not found: {"error": "location id not found"}
Method: GET
>```
>{{URI}}/api/get_dates?location_id=0
>```
### Query Params

|Param|value|
|---|---|
|location_id|0|



⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃


## End-point: Get Slots
### Description: Returns slot data for location and date

Params
- location_id: Location ID
- date: (dd/mm/yyyy) date

Return (json)
- Success {"location":{"location_id":ID, "location_name": name}, "date":date "slots":[{"slot": 0-23, "available_nurses":number, "capacity" available_nurses * nurse_capacity, "available_space": space, "patients":[{"patient_id": ID, "patient_name": Name, "patient_email": email, ...}] }, ...]}
- Error Location ID or date not found: {"error": "location Id or Date not found"}
- Error Date Format: {"error": "date format is dd/mm/yyyy"}
Method: GET
>```
>{{URI}}/api/get_slots?location_id=0&date=28/09/2021
>```
### Query Params

|Param|value|
|---|---|
|location_id|0|
|date|28/09/2021|



⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃


## End-point: Add or Update Date
### Description: Create or Update a location date and set default nurses available for all slots
Newly created Date would have 0800 to 2000 (1 hour per slot) Time slots with default the default number of slots set

Params
- location_id:  Location ID
- date:(dd/mm/yyyy) date to update or create
- available_nurses: number of default nurses
  
Return (JSON)
- Success: {"success":"date updated or created", "location_id": ID, "date": date, "available_nurses": number}
- Error Date Format: {"error": "date format is dd/mm/yyyy"}
- Error Location ID required: {"error": "Parameter location_id is required"}
- Error Available Nurses Required: {"error": "Parameter available_nurses is required"}
- Error Date Format: {"error": "Parameter date is required"}
Method: PUT
>```
>{{URI}}/api/add_update_date
>```
### Body (**raw**)

```json
{"location_id": 1,
"date":"23/12/2021",
"available_nurses":2}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃


## End-point: Add or Update Slot
### Description: Create or Update a location date slot and set number of nurses available

Params
- location_id:  Location ID
- date:(dd/mm/yyyy) date to update or create
- slot: time in hours, 0-23
- available_nurses: number nurses available
  
Return (JSON)
- Success: {"success":"slot updated or created", "location_id": ID, "date": date, "slot": slot(0-24), "available_nurses": number}
- Error Location ID not found: {"error": "location id not found"}
- Error Location ID required: {"error": "Parameter location_id is required"}
- Error Slot required: {"error": "Parameter slot is required"}
- Error Date Format: {"error": "Parameter date is required"}
- Error Date Format: {"error": "date format is dd/mm/yyyy"}
- Error Slot Format: {"error": "time format is hours from 0-23"}
Method: PUT
>```
>{{URI}}/api/add_update_slot
>```
### Body (**raw**)

```json
{"location_id": 0,
"date":"27/09/2021",
"slot":18,
"available_nurses":92}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃


## End-point: Delete Location
### Description: Deletes a location (all reservations will be lost for this location)

Params
- location_id: Location ID

Return (JSON)
- Success: {"success":"location deleted, all reservations removed for this location", "location_id": ID}
- Error Location ID not found: {"error": "location id not found"}
Method: DELETE
>```
>{{URI}}/api/delete_location
>```
### Body (**raw**)

```json
{"location_id": 1}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃


## End-point: Delete Date
### Description: Deletes a date (all reservations will be lost for this date)

Params
- location_id: Location ID
- date: (dd/mm/yyyy) date to delete

Return (JSON)
- Success: {"success":"date deleted, all reservations removed for this date", "location_id": ID, "date": date}
- Error Location ID not found: {"error": "location id not found"}
    Error Date Format: {"error": "date format is dd/mm/yyyy"}
Method: DELETE
>```
>{{URI}}/api/delete_date
>```
### Body (**raw**)

```json
{"location_id": 0,
"date":"22/09/2021"}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃


## End-point: Delete Slot
### Description: Deletes a slot (all reservations will be lost for this slot)

Params
= location_id: Location ID
- date: (dd/mm/yyyy) date
- slot: time in hours, 0-23

Return (JSON)
- Success: {"success":"slot is deleted, all reservations removed for this slot", "location_id": ID, "date": date, "slot": slot(0-24)}
- Error Location ID not found: {"error": "location id not found"}
- Error Date Format: {"error": "date format is dd/mm/yyyy"}
- Error Time Format: {"error": "time format is hours from 0-23"}
Method: DELETE
>```
>{{URI}}/api/delete_slot
>```
### Body (**raw**)

```json
{"location_id": 0,
"date":"28/09/2021",
"slot":8}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃


## End-point: Register
### Description: Create a patient record and register that patient to a slot

Params
- location_id: ID of the location you want to register to
- date: (dd/mm/yyyy) date you want to register
- slot: time in hours, 0-23
- patient_name: Name of patient
- patient_email: email of patient(this will be our primary identifier)

Return (json)
- Success {"success":"Patient Registered","patient_id:ID", "patient_name":name, "patient_email":email","location_id":ID, "location_name": name, "date":date "slot":0-23}
- Error Email already registered: {"error": "email is already registered, info of existing user follows", "patient_id:ID", "patient_name":name, "patient_email":email","location_id":ID, "location_name": name, "date":date "slot":0-23, }}
- Error Location ID not found: {"error": "location id not found"}
- Error Slot not found: {"error": "Slot not found"}
- Error Date Format: {"error": "date format is dd/mm/yyyy"}
- Error Slot Format: {"error": "Slot format is hours from 0-23"}
- Error Slot not available {"error": "Slot is Full, Please choose a different slot"}
Method: POST
>```
>{{URI}}/api/register
>```
### Body (**raw**)

```json
{"location_id": 0,
"date":"28/09/2021",
"slot":11,
"patient_name":"Beejay",
"patient_email":"beejay.urzo@gmail.com2"}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃


## End-point: Update Schedule
### Description: Update a user's schedule

Params
- location_id: ID of the location you want to move to
- date: (dd/mm/yyyy) date you want to move to
- slot: time in hours, 0-23
- patient_name: Name of patient
- patient_email: email of patient(this will be our primary identifier)

Return (json)
- Success {"success":"Patient Registered","patient_id:ID", "patient_name":name, "patient_email":email","location_id":ID, "location_name": name, "date":date "slot":0-23}
- Error Not registered: {"error": "This patient is not registered, please register the user"}
- Error Location ID not found: {"error": "location id not found"}
- Error Slot not found: {"error": "Slot not found"}
- Error Date Format: {"error": "date format is dd/mm/yyyy"}
- Error Slot Format: {"error": "Slot format is hours from 0-23"}
- Error Slot not available {"error": "Slot is Full, Please choose a different slot"}
Method: PUT
>```
>{{URI}}/api/update_schedule
>```
### Body (**raw**)

```json
{"location_id": 0,
"date":"28/09/2021",
"slot":10,
"patient_name":"Beejay",
"patient_email":"beejay.urzo@gmail.com2"}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃


## End-point: Update Nurse to Patient Ratio
### Description: Sets how many patients a nurse can handle. Will define the capacity of a Slot
Method: GET
>```
>{{URI}}/api/update_ratio?ratio=5
>```
### Body (**raw**)

```json

```

### Query Params

|Param|value|
|---|---|
|ratio|5|



⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

_________________________________________________
Author: [bautistaj](https://github.com/bautistaj)

Package: [postman-to-markdown](https://github.com/bautistaj)
