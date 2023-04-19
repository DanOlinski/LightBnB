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
  return getAllProperties(null, 2);
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  
  const values = [limit];
  const queryString = `
SELECT avg(property_reviews.rating) as average_rating, properties.*
FROM properties
JOIN property_reviews ON properties.id = property_reviews.property_id
GROUP BY
properties.title, 
properties.id, 
properties.owner_id,
properties.description,
properties.thumbnail_photo_url,
properties.cover_photo_url,
properties.cost_per_night,
properties.parking_spaces,
properties.number_of_bathrooms,
properties.number_of_bedrooms,
properties.country,
properties.street,
properties.city,
properties.province,
properties.post_code,
properties.active
LIMIT $1;
`;
  return pool
    .query(queryString, values)
    .then(res => {
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
