/*
Group 27 - Project Adapt
Alexander Wong
Kai Wishart
*/

-- Disable Autocommit and Foreign Key checks
SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

DROP TABLE IF EXISTS Manga_Readers;
DROP TABLE IF EXISTS Manga;
DROP TABLE IF EXISTS Anime;
DROP TABLE IF EXISTS Studios;
DROP TABLE IF EXISTS Authors;
DROP TABLE IF EXISTS Readers;

-- Creates Authors Table
CREATE TABLE Authors(
    author_id int(11) auto_increment not null,
    name varchar(50) not null,
    primary key(author_id)
);

-- Creates Studios Table
CREATE TABLE Studios(
    studio_id int(11) auto_increment not null,
    name varchar(50) not null,
    establish_date date not null,
    website varchar(255) not null,
    anime_count int(11) not null,
    primary key(studio_id)
);

-- Creates Anime Table
CREATE TABLE Anime(
    anime_id int(11) auto_increment not null,
    title varchar(255) not null,
    studio_id int(11) not null,
    average_score decimal(4,2) not null,
    viewership int(11) not null,
    primary key(anime_id),
    foreign key(studio_id) references Studios(studio_id) ON DELETE CASCADE
);

-- Creates Manga Table
CREATE TABLE Manga(
    manga_id int(11) auto_increment not null,
    title varchar(255) not null,
    publisher varchar(50) not null,
    genre varchar(50) not null,
    demographic varchar(50) not null,
    average_score decimal(4,2) not null,
    monthly_readers int(11) not null,
    author_id int(11) not null,
    anime_id int(11),
    primary key(manga_id),
    foreign key(author_id) references Authors(author_id) ON DELETE CASCADE,
    foreign key(anime_id) references Anime(anime_id) ON DELETE SET NULL
);

-- Creates Readers Table
CREATE TABLE Readers(
    reader_id int(11) auto_increment not null,
    name varchar(255) not null,
    age int(11) not null,
    gender varchar(30) not null,
    country varchar(255) not null,
    primary key(reader_id)
);

-- Creates Manga_Readers intersection Table
CREATE TABLE Manga_Readers(
    manga_id int(11) not null,
    reader_id int(11) not null,
    foreign key(manga_id) references Manga(manga_id) ON DELETE CASCADE,
    foreign key(reader_id) references Readers(reader_id) ON DELETE CASCADE
);

-- Populates Authors Table with sample data
INSERT INTO Authors(
    name
)
VALUES
(
    'Miura, Kentarou'
),
(
    'Yazawa, Ai'
),
(
    'Oda, Eiichiro'
),
(
    'Ichikawa, Haruko'
),
(
    'Umino, Chica'
);

-- Populates Studios Table with sample data
INSERT INTO Studios(
    name,
    establish_date,
    website,
    anime_count
)
VALUES
(
    'OLM',
    '1990-10-03',
    'https://olm.co.jp/',
    354
),
(
    'Madhouse',
    '1972-10-17',
    'https://www.madhouse.co.jp/',
    1221
),
(
    'Toei Animation',
    '1948-01-23',
    'https://corp.toei-anim.co.jp/ja/index.html',
    4350
),
(
    'Orange',
    '2004-05-01',
    'https://www.orange-cg.com/',
    10
),
(
    'Shaft',
    '1975-09-01',
    'https://www.shaft-web.co.jp/',
    808
);

-- Populates Anime Table with sample data
INSERT INTO Anime(
    title,
    studio_id,
    average_score,
    viewership
)
VALUES
(
    'Berserk',
    (SELECT studio_id FROM Studios WHERE name='OLM'),
    8.57,
    620000
),
(
    'Nana',
    (SELECT studio_id FROM Studios WHERE name='Madhouse'),
    8.54,
    638000
),
(
    'One Piece',
    (SELECT studio_id FROM Studios WHERE name='Toei Animation'),
    8.71,
    2300000
),
(
    'Houseki no Kuni',
    (SELECT studio_id FROM Studios WHERE name='Orange'),
    8.39,
    445000
),
(
    'March Comes in Like a Lion',
    (SELECT studio_id FROM Studios WHERE name='Shaft'),
    8.38,
    663000
);

-- Populates Manga Table with sample data
INSERT INTO Manga(
    title,
    publisher,
    genre,
    demographic,
    average_score,
    monthly_readers,
    author_id,
    anime_id
)
VALUES 
(
    'Berserk',
    'Hakusensha',
    'Action, Adventure, Fantasy',
    'Seinen',
    9.47,
    6000,
    (SELECT author_id FROM Authors where name='Miura, Kentarou'),
    (SELECT anime_id FROM Anime where title='Berserk')
),
(
    'Nana',
    'Shueisha',
    'Drama, Romance',
    'Shoujo',
    8.79,
    1500,
    (SELECT author_id FROM Authors where name='Yazawa, Ai'),
    (SELECT anime_id FROM Anime where title='Nana')

),
(
    'One Piece',
    'Shueisha',
    'Action, Adventure, Fantasy',
    'Shounen',
    9.22,
    7500,
    (SELECT author_id FROM Authors where name='Oda, Eiichiro'),
    (SELECT anime_id FROM Anime where title='One Piece')
),
(
    'Houseki no Kuni',
    'Kodansha',
    'Action, Drama, Fantasy',
    'Seinen',
    8.96,
    3000,
    (SELECT author_id FROM Authors where name='Ichikawa, Haruko'),
    (SELECT anime_id FROM Anime where title='Houseki no Kuni')
),
(
    '3-gatsu no Lion',
    'Hakusensha',
    'Drama, Slice of Life',
    'Seinen',
    8.88,
    2500,
    (SELECT author_id FROM Authors where name='Umino, Chica'),
    (SELECT anime_id FROM Anime where title='March Comes in Like a Lion')
);

-- Populates Readers Table with sample data
INSERT INTO Readers(
    name,
    age,
    gender,
    country
)
VALUES 
(
    'Nemo',
    12,
    'Male',
    'United States'
),
(
    'Dora',
    15,
    'Female',
    'Canada'
),
(
    'Monty',
    34,
    'Male',
    'Spain'
),
(
    'Lonnie',
    22,
    'Female',
    'Italy'
),
(
    'Mahometus',
    56,
    'Male',
    'Brazil'
);

-- Populates Manga_Readers Table with Foreign Keys from Manga and Readers
INSERT INTO Manga_Readers(
    manga_id,
    reader_id
)
VALUES
(
    (SELECT manga_id FROM Manga WHERE title='Nana'),
    (SELECT reader_id FROM Readers WHERE name='Nemo')
),
(
    (SELECT manga_id FROM Manga WHERE title='Berserk'),
    (SELECT reader_id FROM Readers WHERE name='Dora')
),
(
    (SELECT manga_id FROM Manga WHERE title='Houseki no Kuni'),
    (SELECT reader_id FROM Readers WHERE name='Monty')
),
(
    (SELECT manga_id FROM Manga WHERE title='One Piece'),
    (SELECT reader_id FROM Readers WHERE name='Lonnie')
),
(
    (SELECT manga_id FROM Manga WHERE title='3-gatsu no Lion'),
    (SELECT reader_id FROM Readers WHERE name='Mahometus')
);


-- Re-enable foreign key checks and autocommit as recommended in assignment doc 
SET FOREIGN_KEY_CHECKS=1;
COMMIT;