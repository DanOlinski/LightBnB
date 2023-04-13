--Show all reservations for a user.
SELECT reservations.id, properties.title, properties.cost_per_night, reservations.start_date, AVG(property_reviews.rating) as average_rating
FROM properties
JOIN reservations ON reservations.property_id = properties.id
JOIN property_reviews ON property_reviews.property_id = properties.id
WHERE reservations.guest_id = 1
GROUP BY properties.title, reservations.id, reservations.start_date, properties.cost_per_night
ORDER BY reservations.start_date
LIMIT 10;