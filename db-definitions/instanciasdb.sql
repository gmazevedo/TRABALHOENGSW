DROP TABLE IF EXISTS Users CASCADE;
DROP TABLE IF EXISTS Sessions CASCADE;

CREATE TABLE Users	 
( 
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(30) NOT NULL,  
  password VARCHAR(24) NOT NULL,
  member_of TEXT[],
  leader_of TEXT[],
  CONSTRAINT users_pkey PRIMARY KEY (user_id),
  CONSTRAINT email UNIQUE(email)
);

CREATE TABLE Sessions
( 
  session_id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  leader TEXT[] NOT NULL,
  members TEXT[] NOT NULL,
  CONSTRAINT sessions_pkey PRIMARY KEY (session_id)
);

-- Populando as tabelas

-- Users
INSERT INTO Users (name,email,password,member_of,leader_of) VALUES ('Moises Silva', 'moises@gmail.com','Teste123','{2,4}','{1}');
INSERT INTO Users (name,email,password,member_of,leader_of) VALUES ('Joana Oliveira', 'joana@gmail.com','Teste123','{1,5}','{2,3}');
INSERT INTO Users (name,email,password,member_of,leader_of) VALUES ('Joao Ferreira Silva', 'joana@gmail.com','Teste123','{3}','{4,5}');


-- Sessions
INSERT INTO Sessions (name,leader,members) VALUES ('Sessao 01','{1}', '{2}');
INSERT INTO Sessions (name,leader,members) VALUES ('Sessao 02','{2}', '{1}');
INSERT INTO Sessions (name,leader,members) VALUES ('Sessao 03','{2}', '{3}');
INSERT INTO Sessions (name,leader,members) VALUES ('Sessao 04','{3}', '{1}');
INSERT INTO Sessions (name,leader,members) VALUES ('Sessao 05','{3}', '{2}');