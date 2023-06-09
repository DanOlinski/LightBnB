--inserting 3 rows in users table from lightbnb database
INSERT INTO users (
name, email, password) 
VALUES (
'User One', 'userone@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
    
INSERT INTO users (
name, email, password) 
VALUES (
'User Two', 'usertwo@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO users (
name, email, password) 
VALUES (
'User Three', 'userthreee@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

--inserting 3 rows in properties table from lightbnb database
INSERT INTO properties (
title, description, owner_id, cover_photo_url, thumbnail_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, active, province, city, country, street, post_code) 
VALUES (
'Property One', 'Beautiful condo in a central area, with easy access to entertainment and other facilities', 1, 'https://media.istockphoto.com/id/1322277517/photo/wild-grass-in-the-mountains-at-sunset.jpg?s=612x612&w=0&k=20&c=6mItwwFFGqKNKEAzv0mv6TaxhLN3zSE43bWmFN--J5w=', 'https://media.istockphoto.com/id/1322277517/photo/wild-grass-in-the-mountains-at-sunset.jpg?s=612x612&w=0&k=20&c=6mItwwFFGqKNKEAzv0mv6TaxhLN3zSE43bWmFN--J5w=', 300000, 0, 3, 2, true, 'Alberta', 'Calgary', 'Canada', '1304 Rosehill Drive', 'T2K1M4');

INSERT INTO properties (
title, description, owner_id, cover_photo_url, thumbnail_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, active, province, city, country, street, post_code) 
VALUES (
'Property Two', 'Nice hypothetical place with an amazing view', 2, 'https://media.istockphoto.com/id/1322277517/photo/wild-grass-in-the-mountains-at-sunset.jpg?s=612x612&w=0&k=20&c=6mItwwFFGqKNKEAzv0mv6TaxhLN3zSE43bWmFN--J5w=', 'https://media.istockphoto.com/id/1322277517/photo/wild-grass-in-the-mountains-at-sunset.jpg?s=612x612&w=0&k=20&c=6mItwwFFGqKNKEAzv0mv6TaxhLN3zSE43bWmFN--J5w=', 200000, 1, 3, 2, true, 'Alberta', 'Calgary', 'Canada', '517 2dn Street', 'T2K1M3');

INSERT INTO properties (
title, description, owner_id, cover_photo_url, thumbnail_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, active, province, city, country, street, post_code) 
VALUES (
'Property Three', 'Beautiful townhouse, perfect for couple, cozy neighborhood', 3, 'https://media.istockphoto.com/id/1322277517/photo/wild-grass-in-the-mountains-at-sunset.jpg?s=612x612&w=0&k=20&c=6mItwwFFGqKNKEAzv0mv6TaxhLN3zSE43bWmFN--J5w=', 'https://media.istockphoto.com/id/1322277517/photo/wild-grass-in-the-mountains-at-sunset.jpg?s=612x612&w=0&k=20&c=6mItwwFFGqKNKEAzv0mv6TaxhLN3zSE43bWmFN--J5w=', 250000, 1, 3, 2, true, 'Alberta', 'Calgary', 'Canada', '213 Brentwood Close', 'T2K1M6');
    
    
--inserting 3 rows in reservations table from lightbnb database
INSERT INTO reservations (
id, guest_id, property_id, start_date, end_date) 
VALUES (
1, 3, 2, '2023-01-01', '2023-02-02');

INSERT INTO reservations (
id, guest_id, property_id, start_date, end_date) 
VALUES (
2, 1, 3, '2023-05-05', '2023-03-03');

INSERT INTO reservations (
id, guest_id, property_id, start_date, end_date) 
VALUES (
3, 2, 1, '2023-02-02', '2023-04-04');
    
    
    
--inserting 3 rows in property_reviews table from lightbnb database
INSERT INTO property_reviews (
guest_id, property_id, reservation_id, rating, message) 
VALUES (
1, 2, 1, 4, 'great time chilling at the cabin');

INSERT INTO property_reviews (
guest_id, property_id, reservation_id, rating, message) 
VALUES (
2, 3, 2, 5, 'great times');

INSERT INTO property_reviews (
guest_id, property_id, reservation_id, rating, message) 
VALUES (
3, 1, 3, 4, 'enjoyed the stay');