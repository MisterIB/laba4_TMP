var express = require('express');
var router = express.Router();
const db = require('../db/db');
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const jwt = require ('jsonwebtoken');
const authConfig = require('../config/auth.config')
const authJwt = require('../middleware/authjwt');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/signin', async (req, res) => {
  try {
    
    const user = await db.getUser(req.body.username)
    if (user === null) throw `Couldn't get user`
    if (!bcrypt.compareSync(req.body.password, user.hash_password))
      return res.status(401).json({
      accessToken: null,
      message: "Invalid Password!",
  });

  const token = jwt.sign({ id: user.id,  role: user.access_right}, authConfig.secret(), {
    expiresIn: 86400, // 24 hours
  });

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true
    }).send({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.access_right,
    })
    res.status(201)
  } catch(err) {
    console.log(err)
    res.status(400).send({error: true, message: `Couldn't sign in`})
  }
});

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body
    const hashedPassword = bcrypt.hashSync(password, 10)
    
    const user = await db.createUser(username, email, hashedPassword)
    if (user === null) throw `Couldn't save user to database`

    res.status(201).send({error: false})
  } catch (err) {
    console.log(err)
    res.status(400).send({error: true, message: `Couldn't register`})
  }
});

router.post('/signout', async (req, res) => {
  try {
    res.clearCookie('access_token')
    res.send({error: false})
  } catch (err) {
    console.log(err)
    res.status(400).send({error: true, message: `Couldn't sign out.`})
  }
})

router.get('/items', [authJwt.verifyToken], async (req, res) => {
  try {
    const items = await db.getItems()
    if (items === null) throw `Couldn't get items`
    res.status(200).send(items)
  } catch (err) {
    console.log(err)
    res.status(400).send({error: true, message: `Couldn't get items`})
  }
})

router.get('/items/:id', [authJwt.verifyToken], async (req, res) => {
  try {
    const id = req.params.id
    const items = await db.getItemsByID(id)
    if (items === null) throw `Couldn't get items`
    res.status(200).send({
      id: items.id,
      name: items.name,
      manufacturer: items.manufacturer,
      status: items.status,
      errors: items.errors
    })
  } catch (err) {
    console.log(err)
    res.status(400).send({error: true, message: `Couldn't get item`})
  }
})

router.put('/items/:id', [authJwt.verifyToken], async (req, res) => {
  try {
    const id = req.params.id
    const { name, manufacturer, status, errors } = req.body
    const items = await db.updateItemByID(id, name, manufacturer, status, errors)
    res.status(200).send(items)
  } catch (err) {
    console.log(err)
    res.status(400).send({error: true, message: `Couldn't edit item`})
  }
})

router.post('/items', [authJwt.verifyToken], async (req, res) => {
  try {
    const { name, manufacturer, status, errors } = req.body
    const items = await db.createItem(name, manufacturer, status, errors)
    res.status(200).send(items)
  } catch (err) {
    console.log(err)
    res.status(400).send({error: true, message: `Couldn't add items`})
  }
})

router.delete('/items/:id', [authJwt.verifyToken], async (req, res) => {
  try {
    const id = req.params.id
    const items = await db.deleteItem(id)
    res.status(200).send(items)
  } catch (err) {
    console.log(err)
    res.status(400).send({error: true, message: `Couldn't delete items`})
  }
})

router.get('/cars', [authJwt.verifyToken], async (req, res) => {
  try {
    const id = req.query.userId
    const cars = await db.getCars(id)
    res.status(200).send(cars)
  } catch (err) {
    console.log(err)
    res.status(400).send({error: true, message: `Couldn't get cars`})
  }
})

router.post('/cars', [authJwt.verifyToken], async (req, res) => {
  try {
    const { model, plate, color, RCmodel, MDSmodel, OSCmodel, userId } = req.body
    const car = await db.addCar(model, plate, color, RCmodel, MDSmodel, OSCmodel, userId)
    res.status(200).send(car)
  } catch (err) {
    console.log(err)
    res.status(400).send({error: true, message: `Couldn't add car`})
  }
})

router.delete('/cars', [authJwt.verifyToken], async (req, res) => {
  try {
    const id = req.query.carId
    console.log(id)
    const car = await db.deleteCar(id)
    res.status(200).send(car)
  } catch (err) {
    console.log(err)
    res.status(400).send({error: true, message: `Couldn't delete car`})
  }
})

router.get('/cars/:id', [authJwt.verifyToken], async (req, res) => {
  try {
    const id = req.params.id
    const car = await db.getCar(id)
    if (car === null) throw `Couldn't get car`
    res.status(200).send({
      id: car.id,
      model: car.model,
      plate: car.plate,
      color: car.color
    })
  } catch (err) {
    console.log(err)
    res.status(400).send({error: true, message: `Couldn't get car`})
  }
})

router.get('/route_computer/:id', [authJwt.verifyToken],  async (req, res) => {
  try {
    const id = req.params.id
    const rc = await db.getRC(id)
    if (rc === null) throw `Couldn't get route computer`
    res.status(200).send({
      id: rc.id,
      model: rc.model,
      fuel_consumption: rc.fuel_consumption,
      mileage : rc.mileage 
    })
  } catch (err) {
    console.log(err)
    res.status(400).send({error: true, message: `Couldn't get route computer`})
  }
})

router.put('/route_computer/:id', [authJwt.verifyToken], async (req, res) => {
  try {
    const id = req.params.id
    const { model, fuel_consumption, mileage } = req.body
    const rc = await db.updateRC(id, model, fuel_consumption, mileage)
    res.status(200).send(rc)
  } catch (err) {
    console.log(err)
    res.status(400).send({error: true, message: `Couldn't put route computer`})
  }
})

router.get('/onboard_control/:id', [authJwt.verifyToken], async (req, res) => {
  try {
    const id = req.params.id
    const ocs = await db.getOCS(id)
    if (ocs === null) throw `Couldn't get onboard control system`
    res.status(200).send({
      id: ocs.id,
      model: ocs.model,
      brake_linings_status: ocs.brake_linings_status,
      engine_oil_level: ocs.engine_oil_level,
      brake_fluid_level: ocs.brake_fluid_level,
      transmission_fluid_level: ocs.transmission_fluid_level,
      coolant_level: ocs.coolant_level,
      filter_status: ocs.filter_status,
      instrument_lamps_status: ocs.instrument_lamps_status
    })
  } catch (err) {
    console.log(err)
    res.status(400).send({error: true, message: `Couldn't get onboard control system`})
  }
})

router.put('/onboard_control/:id', [authJwt.verifyToken], async (req, res) => {
  try {
    const id = req.params.id
    const { model, brake_linings_status, engine_oil_level, brake_fluid_level, transmission_fluid_level, coolant_level, filter_status, instrument_lamps_status } = req.body
    const osc = await db.updateOSC(id, model, brake_linings_status, engine_oil_level, brake_fluid_level, transmission_fluid_level, coolant_level, filter_status, instrument_lamps_status)
    res.status(200).send(osc)
  } catch (err) {
    console.log(err)
    res.status(400).send({error: true, message: `Couldn't put onboard control system`})
  }
})

router.get('/measuring_device/:id', [authJwt.verifyToken], async (req, res) => {
  try {
    const id = req.params.id
    const mds = await db.getMDS(id)
    if (mds === null) throw `Couldn't get measuring device`
    res.status(200).send({
      id: mds.id,
      model: mds.model,
      fuel_quantity: mds.fuel_quantity,
      coolant_temperature: mds.coolant_temperature,
      oil_pressure: mds.oil_pressure
    })
  } catch (err) {
    console.log(err)
    res.status(400).send({error: true, message: `Couldn't get measuring device`})
  }
})

router.put('/measuring_device/:id', [authJwt.verifyToken], async (req, res) => {
  try {
    const id = req.params.id
    const { model, fuel_quantity, coolant_temperature, oil_pressure } = req.body
    const mds = await db.updateMDS(id, model, fuel_quantity, coolant_temperature, oil_pressure)
    res.status(200).send(mds)
  } catch (err) {
    console.log(err)
    res.status(400).send({error: true, message: `Couldn't put measuring device`})
  }
})

module.exports = router;
