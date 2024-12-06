CREATE USER 'nuevousuario'@'%' IDENTIFIED BY 'password';

GRANT ALL PRIVILEGES ON *.* TO 'nuevousuario'@'%' WITH GRANT OPTION;


FLUSH PRIVILEGES;


create database if not exists basededatos;
use basededatos;


create table if not exists pokemon_raw (
   pokedex_number    int not null,
   name              varchar(255) not null,
   abilities         text not null,
   attack            int not null,
   defense           int not null,
   speed             int not null,
   hp                int not null,
   sp_attack         int not null,
   sp_defense        int not null,
   base_total        int not null,
   base_egg_steps    int not null,
   base_happiness    int not null,
   weight_kg         varchar(255), 
   height_m          varchar(255),   
   capture_rate      int not null,
   classification    varchar(255) not null,
   type1             varchar(50) not null,
   type2             varchar(50),
   experience_growth int not null,
   percentage_male   varchar(255), 
   generation        int not null,
   is_legendary      varchar(1) not null
);



LOAD DATA INFILE '/var/lib/mysql-files/pokemon_cleaned.txt'
INTO TABLE pokemon_raw
FIELDS TERMINATED BY '\t'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(pokedex_number, name, abilities, attack, defense, speed, hp, sp_attack, sp_defense, base_total, 
 base_egg_steps, base_happiness, weight_kg, height_m, capture_rate, classification, type1, type2, 
 experience_growth, percentage_male, generation, is_legendary);



CREATE TABLE if not exists pokemon (
    pokedex_number INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    abilities TEXT NOT NULL,
    attack INT NOT NULL,
    defense INT NOT NULL,
    speed INT NOT NULL,
    hp INT NOT NULL,
    sp_attack INT NOT NULL,
    sp_defense INT NOT NULL,
    base_total INT NOT NULL,
    base_egg_steps INT NOT NULL,
    base_happiness INT NOT NULL,
    weight_kg FLOAT,   
    height_m FLOAT,    
    capture_rate INT NOT NULL,
    classification VARCHAR(255) NOT NULL,
    type1 VARCHAR(50) NOT NULL,
    type2 VARCHAR(50),
    experience_growth INT NOT NULL,
    percentage_male FLOAT,  
    generation INT NOT NULL,
    is_legendary ENUM('N', 'Y') NOT NULL
);


insert into pokemon
   select pokedex_number,
          name,
          abilities,
          attack,
          defense,
          speed,
          hp,
          sp_attack,
          sp_defense,
          base_total,
          base_egg_steps,
          base_happiness,
          nullif(
             weight_kg,
             'NULL'
          ) as weight_kg,  
          nullif(
             height_m,
             'NULL'
          ) as height_m,    
          capture_rate,
          classification,
          type1,
          nullif(
             type2,
             'NULL'
          ) as type2,          
          experience_growth,
          nullif(
             percentage_male,
             'NULL'
          ) as percentage_male,  
          generation,
          is_legendary
     from pokemon_raw;

SELECT * FROM pokemon LIMIT 10;
