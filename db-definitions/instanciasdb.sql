DROP TABLE IF EXISTS Users CASCADE;
DROP TABLE IF EXISTS Sessions CASCADE;

CREATE TABLE Users	 
( 
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(30) NOT NULL,  
  password VARCHAR(24) NOT NULL,
  member_of VARCHAR(30),
  leader_of VARCHAR(20),
  CONSTRAINT id_email UNIQUE(user_id, email)
);

CREATE TABLE Sessions
( 
  session_id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  leader VARCHAR(50) NOT NULL,
  members VARCHAR(80) NOT NULL
);

-- Populando as tabelas

-- Users
INSERT INTO Users (name,email,password,member_of,leader_of) VALUES ('Moises Silva', 'moises@gmail.com','Teste123',null,'Sessao01');
INSERT INTO Users (name,email,password,member_of,leader_of) VALUES ('Joana Oliveira', 'joana@gmail.com','Teste123','Sessao01',null);


-- Sessions
INSERT INTO Sessions (name,leader,members) VALUES ('Sessao01','Moises Silva', 'Joana Oliveira');