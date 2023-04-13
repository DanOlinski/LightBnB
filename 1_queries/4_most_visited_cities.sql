--Get a list of the most visited cities.
SELECT city, COUNT(property_id) as total_reservations
FROM reservations
JOIN properties ON property_id = properties.id
GROUP BY city
ORDER BY total_reservations DESC;


