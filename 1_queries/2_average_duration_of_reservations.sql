--Get the average duration of all reservations.
SELECT ROUND(AVG(end_date - start_date), 2) as average_duration
FROM reservations;
