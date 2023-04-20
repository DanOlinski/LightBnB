const properties = require("./json/properties.json");
const { Pool } = require('pg');


//Start connection to local database. Make sure user, password and database correspond to the info in your local computer
const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithEmail = function(email) {
  if (!email) {
    return null;
  }

  const values = [email];
  const queryString = `
  SELECT *
  FROM users
  WHERE email = $1;
  `;
  return pool.query(queryString, values)
    .then(res => {
      return res.rows[0];
    });
};
/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  if (!id) {
    return null;
  }
  const values = [id];
  const queryString = `
  SELECT *
  FROM users
  WHERE id = $1;
  `;
  return pool.query(queryString, values)
    .then(res => {
      return res.rows[0];
    });

};
/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  if (!user.email || !user.name || !user.password) {
    return null;
  }
  const values = [user.name, user.email, user.password];
  const queryString = `
  INSERT INTO users (
    name, 
    email, 
    password
    ) 
    VALUES (
    $1, 
    $2, 
    $3
    )
    RETURNING *;`;
  return pool.query(queryString, values)
    .then(res => {
      return res.rows[0];
    });
};
/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const values = [guest_id, limit];
  const queryString = `
  SELECT avg(property_reviews.rating) as average_rating, properties.*, reservations.*
  FROM properties
  JOIN property_reviews ON properties.id = property_reviews.property_id
  JOIN reservations ON properties.id = reservations.property_id
  WHERE reservations.guest_id = $1
  GROUP BY
  properties.id, 
  reservations.id
  LIMIT $2;
  `;
  return pool.query(queryString, values)
    .then(res => {
      return res.rows;
    });
};
/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  
  const values = [];
  let queryString = `
SELECT avg(property_reviews.rating) as average_rating, properties.*
FROM properties
JOIN property_reviews ON properties.id = property_reviews.property_id
`;

if(options){
if(Object.keys(options).length !== 0){
  queryString += `WHERE `
}

let booleanOptions = false

if (options.city) {
  booleanOptions = true
  values.push(`%${options.city}%`);
  queryString += `city LIKE $${values.length}`;
}

if (options.owner_id) {
  if(booleanOptions){
    queryString += `AND `
  }
  booleanOptions = true
  values.push(`%${options.owner_id}%`);
  queryString += `owner_id LIKE $${values.length}`;
}

if (options.minimum_price_per_night) {
  if(booleanOptions){
    queryString += `AND `
  }
  booleanOptions = true
  values.push(Number(options.minimum_price_per_night)*100);
  queryString += `properties.cost_per_night > $${values.length}`;
}
if (options.maximum_price_per_night) {
  if(booleanOptions){
    queryString += `AND `
  }
  booleanOptions = true
  values.push(Number(options.maximum_price_per_night,)*100);
  queryString += `properties.cost_per_night < $${values.length}`;
}
if (options.minimum_rating) {
  if(booleanOptions){
    queryString += `AND `
  }
  booleanOptions = true
  values.push(options.minimum_rating);
  queryString += `property_reviews.rating >= $${values.length}`;
}
}
values.push(limit);
queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${values.length};
  `;

  console.log(queryString)
  console.log(values)
  console.log(options)
  return pool
    .query(queryString, values)
    .then(res => {
      console.log(res.rows)
      return res.rows;
    });
};
/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
