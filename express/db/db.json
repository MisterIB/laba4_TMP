const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres', 
    host: 'localhost', 
    database: 'postgres', 
    password: '080906', 
    port: 5432, 
  });  

exports.getUser = async username => {
  const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return rows[0]
};

exports.createUser = async (username, email, password)  => {
  const { rows } = await pool.query('INSERT INTO users (username, id_access_right, email, hash_password) VALUES ($1, 2, $2, $3) RETURNING *', [username, email, password])
  return rows?.length >= 1 ? rows[0] : null
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const result = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, email, id]);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = $1;', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.getItems = async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM car_details');
  return rows
}

exports.getItemsByID = async id => {
  const { rows } = await pool.query('SELECT * FROM car_details WHERE id = $1', [id])
  return rows[0]
}

exports.updateItemByID = async (id, name, manufacturer, status, errors) => {
  const result = await pool.query('UPDATE car_details SET name = $1, manufacturer = $2, status = $3, errors = $4 WHERE id = $5 RETURNING *', [name, manufacturer, status, errors, id]);
  return(result.rows[0])
}

exports.createItem = async (name, manufacturer, status, errors) => {
  const result = await pool.query('INSERT INTO car_details (name, manufacturer, status, errors) VALUES ($1, $2, $3, $4);', [name, manufacturer, status, errors])
  return(result.rows[0])
}

exports.deleteItem = async id => {
  const result = await pool.query('DELETE FROM car_details WHERE id = $1;', [id])
  return result
}


exports.getCars = async id_user => {
  const {rows} = await pool.query('SELECT * FROM car WHERE id_user = $1', [id_user])
  return rows
}

exports.getCar = async id => {
  const { rows } = await pool.query('SELECT * FROM car WHERE id = $1', [id])
  return rows[0]
}

exports.addCar = async (model, plate, color, RCmodel, MDSmodel, OCSmodel, userId) => {
  const { rows } = await pool.query('WITH mds_insert AS ( INSERT INTO measuring_device_system (model, fuel_quantity, coolant_temperature, oil_pressure) VALUES ($1, 50, 85, 3.5) RETURNING id), ocs_insert AS (INSERT INTO onboard_control_system (model, brake_linings_status, engine_oil_level, brake_fluid_level, transmission_fluid_level, coolant_level, filter_status, instrument_lamps_status) VALUES ($2, \'good\', \'normal\', \'normal\', \'normal\', \'normal\', \'clear\', \'ok\') RETURNING id), rc_insert AS (INSERT INTO route_computer (model, fuel_consumption, mileage) VALUES ($3, 8, 15000) RETURNING id), new_car AS (INSERT INTO car (id_user, id_onboard_control_system, id_measuring_device_system, id_route_computer, model, plate, color) SELECT $4, (SELECT id FROM ocs_insert), (SELECT id FROM mds_insert), (SELECT id FROM rc_insert), $5, $6, $7 RETURNING *) SELECT * FROM new_car WHERE id_user = $4 AND plate = $6', [MDSmodel, OCSmodel, RCmodel, userId, model, plate, color])
  return rows[0]
}

exports.deleteCar = async carId => {
  const { rows } = await pool.query('DELETE FROM car WHERE id = $1;', [carId])
  return rows[0]
}

exports.getRC = async id => {
  const { rows } = await pool.query('SELECT rc.id, rc.model, rc.fuel_consumption, rc.mileage FROM car c JOIN route_computer rc ON c.id_route_computer = rc.id WHERE c.id = $1;', [id])
  return rows[0]
}

exports.updateRC = async (id, model, fuel_consumption, mileage) => {
  const { rows } = await  pool.query('UPDATE route_computer rc SET model = $1, fuel_consumption = $2, mileage = $3 FROM car c WHERE c.id = $4 AND c.id_route_computer = rc.id;', [model, fuel_consumption, mileage, id])
  return rows[0]
}

exports.getOCS = async id => {
  const { rows } = await pool.query('SELECT ocs.id, ocs.model, ocs.brake_linings_status, ocs.engine_oil_level, ocs.brake_fluid_level, ocs.transmission_fluid_level, ocs.coolant_level, ocs.filter_status, ocs.instrument_lamps_status FROM car c JOIN onboard_control_system ocs ON c.id_onboard_control_system = ocs.id WHERE c.id = $1;', [id])
  return rows[0]
}

exports.updateOSC = async (id, model, brake_linings_status, engine_oil_level, brake_fluid_level, transmission_fluid_level, coolant_level, filter_status, instrument_lamps_status) => {
  const { rows } = await pool.query('UPDATE onboard_control_system osc SET model = $1, brake_linings_status = $2, engine_oil_level = $3, brake_fluid_level = $4, transmission_fluid_level = $5, coolant_level = $6, filter_status = $7, instrument_lamps_status = $8 FROM car c WHERE c.id = $9 AND c.id_onboard_control_system = osc.id;', [model, brake_linings_status, engine_oil_level, brake_fluid_level, transmission_fluid_level, coolant_level, filter_status, instrument_lamps_status, id])
  return rows[0]
}

exports.getMDS = async id => {
  const { rows } = await pool.query('SELECT mds.id, mds.model, mds.fuel_quantity, mds.coolant_temperature, mds.oil_pressure FROM car c JOIN measuring_device_system mds ON c.id_measuring_device_system = mds.id WHERE c.id = $1;', [id])
  return rows[0]
}

exports.updateMDS = async (id, model, fuel_quantity, coolant_temperature, oil_pressure) => {
  const { rows } = await pool.query('UPDATE measuring_device_system mds SET model = $1, fuel_quantity = $2, coolant_temperature = $3, oil_pressure = $4 FROM car c WHERE c.id = $5 AND c.id_measuring_device_system = mds.id;', [model, fuel_quantity, coolant_temperature, oil_pressure, id])
  return rows[0]
}
