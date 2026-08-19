drop table if exists Transactions cascade;
drop table if exists Flights cascade;
drop table if exists Bookings cascade; 	
drop table if exists Users cascade;

create table Users(
id serial primary key,
name varchar(100) not null,
email varchar(100) unique not null,
account_created timestamp default current_timestamp
);

select * from users;


CREATE TABLE Flights (
    id SERIAL PRIMARY KEY,
    flight_number VARCHAR(10) NOT NULL,
    destination VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    available_seats INT NOT NULL
);


CREATE TABLE Bookings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    flight_id INT REFERENCES Flights(id),
    status VARCHAR(20) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Transactions (
    id SERIAL PRIMARY KEY,
    booking_id INT REFERENCES Bookings(id),
    card_number VARCHAR(16) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    risk_score INT, 
    status VARCHAR(20) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



INSERT INTO Users (name, email, account_created) VALUES 
('Alex SDE', 'alex@example.com', '2023-01-15 10:00:00'),
('Priya Tech', 'priya@example.com', '2023-11-20 14:30:00'),
('John Doe', 'johndoe@scam.com', CURRENT_TIMESTAMP), 
('Sarah Smith', 'sarah.s@example.com', '2020-05-10 09:15:00'),
('Mike Visa', 'mike.v@example.com', '2024-01-02 18:45:00');


INSERT INTO Flights (flight_number, destination, price, available_seats) VALUES 
('VS101', 'New York', 299.99, 50),
('VS202', 'London', 450.00, 30),
('VS303', 'Tokyo', 899.50, 10),
('VS404', 'Dubai', 650.00, 5),
('VS505', 'Paris', 520.25, 0), 
('VS606', 'Toronto', 199.00, 100),
('VS707', 'Sydney', 1200.00, 15);


INSERT INTO Bookings (user_id, flight_id, status) VALUES 
(1, 2, 'Confirmed'), 
(2, 3, 'Confirmed'), 
(3, 4, 'Pending');   


INSERT INTO Transactions (booking_id, card_number, amount, risk_score, status) VALUES 
(1, '4111111111111111', 450.00, 12, 'Success'),
(2, '5555444433332222', 899.50, 5, 'Success');

select * from users;
