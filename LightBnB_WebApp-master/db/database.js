const { Pool } = require('pg');


//Start connection to local database. Make sure user, password and database correspond to the info in your local computer
const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'lightbnb'
});

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  //return null if no e-mail is passed in
  if (!email) {
    return null;
  }

  const values = [email];
  //selecting all columns from users entity
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
  //return null if id is not passed in
  if (!id) {
    return null;
  }

  const values = [id];
  //select all columns from users entity inside database. filter the user by id
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
  //if information is not provided return null
  if (!user.email || !user.name || !user.password) {
    return null;
  }

  const values = [user.name, user.email, user.password];
  //insert a new user into users entity and return an object with the new user's information
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

  //the options argument is an object that can contain a number of searchable filters
  //this if statement check if any of the searchable filters where activated(added to the searchOptions object), if yes it adds that value and adds a query string to filter that object.
  //if options object is not passed in, js will crash since options.city won't exist, this if prevents js from crashing. if no filter is applied don't run the code
  if (options) {
    //you can't query with more than one WHERE, the next filters have to be written as AND, but we don't know which filter will be active first so this code adds a WHERE, before the correct query
    if (Object.keys(options).length !== 0) {
      //if only options.minimum_rating has a value don't add WHERE
      if (options.minimum_rating && !options.city && !options.maximum_price_per_night && !options.minimum_price_per_night) {
        queryString += ``;
      } else {
        queryString += `WHERE `;
      }
      
    }
    //this will determine if there should be an AND added or not
    let booleanOptions = false;

    if (options.city) {
      //this will let the next filters use AND, since WHERE will already have been used. if city filter isn't activated WHERE will be used instead of AND by the functions below
      booleanOptions = true;
      values.push(`%${options.city}%`);
      queryString += `city LIKE $${values.length}`;
    }

    if (options.owner_id) {
      //if boolean is true it means a filter before this one was activated meaning I need to add an AND, and also set the boolean to true for the next filter to know it has to use AND
      if (booleanOptions) {
        queryString += ` AND `;
      }
      booleanOptions = true;
      values.push(options.owner_id);
      queryString += `owner_id = $${values.length}`;
    }
    if (options.minimum_price_per_night) {
      if (booleanOptions) {
        queryString += ` AND `;
      }
      booleanOptions = true;
      values.push(Number(options.minimum_price_per_night) * 100);
      queryString += `properties.cost_per_night >= $${values.length}`;
    }
    if (options.maximum_price_per_night) {
      if (booleanOptions) {
        queryString += ` AND `;
      }
      booleanOptions = true;
      values.push(Number(options.maximum_price_per_night,) * 100);
      queryString += `properties.cost_per_night <= $${values.length}`;
    }
  }
  
  queryString += `
  GROUP BY properties.id
  `;

  if (options && options.minimum_rating) {
    values.push(options.minimum_rating);
    queryString += `
  HAVING avg(property_reviews.rating) >= $${values.length}
  `;
  }
  
  //this part of the query has to always be present but it has to be at the end of the query that is why it is only added after the above is executed
  values.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${values.length};
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
  /*
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
  */

  const values = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.street,
    property.city,
    property.province,
    property.post_code,
    property.country,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms
  ];
  const queryString = `
  INSERT INTO properties (
    owner_id,
    title,
    description,
    thumbnail_photo_url,
    cover_photo_url,
    cost_per_night,
    street,
    city,
    province,
    post_code,
    country,
    parking_spaces,
    number_of_bathrooms,
    number_of_bedrooms
    ) 
    VALUES (
    $1, 
    $2, 
    $3,
    $4,
    $5,
    $6*100,
    $7,
    $8,
    $9,
    $10,
    $11,
    $12,
    $13,
    $14
    )
    RETURNING *;`;

  return pool.query(queryString, values)
    .then(res => {
      return res.rows[0];
    });
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
