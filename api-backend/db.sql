-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Εξυπηρετητής: 127.0.0.1
-- Χρόνος δημιουργίας: 16 Ιαν 2024 στις 13:42:09
-- Έκδοση διακομιστή: 10.4.27-MariaDB
-- Έκδοση PHP: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Βάση δεδομένων: `tl1`
--

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `akas`
--

CREATE TABLE `akas` (
  `tconst` varchar(20) NOT NULL,
  `ordering` int(5) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `region` varchar(5) DEFAULT NULL,
  `language` varchar(5) DEFAULT NULL,
  `types` varchar(20) DEFAULT NULL,
  `attributes` varchar(50) DEFAULT NULL,
  `isOriginalTitle` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `akas`
--

INSERT INTO `akas` (`tconst`, `ordering`, `title`, `region`, `language`, `types`, `attributes`, `isOriginalTitle`) VALUES
('tt0034841', 1, 'Hen Hop', NULL, NULL, 'original', NULL, 1),
('tt0034841', 2, 'Hen Hop', 'FR', NULL, 'imdbDisplay', NULL, 0),
('tt0034841', 3, 'To pidima tis kotas', 'GR', NULL, 'festival', NULL, 0),
('tt0034841', 4, 'Hen Hop', 'CA', NULL, NULL, NULL, 0),
('tt0040844', 1, 'Crossroads of Laredo', NULL, NULL, 'original', NULL, 1),
('tt0040844', 2, 'The Streets of Laredo', 'US', NULL, 'working', NULL, 0),
('tt0040844', 3, 'Crossroads of Laredo', 'US', NULL, 'imdbDisplay', NULL, 0),
('tt0097924', 1, 'La donna inattesa', 'IT', NULL, NULL, NULL, 0),
('tt0097924', 2, 'Die Frau deines Lebens - Die Unerwartete', 'XWG', NULL, NULL, NULL, 0),
('tt0097924', 3, 'La mujer inesperada', NULL, NULL, 'original', NULL, 1),
('tt0097924', 4, 'La mujer inesperada', 'ES', NULL, NULL, NULL, 0),
('tt0097925', 1, 'La femme impr?visible', 'FR', NULL, NULL, NULL, 0),
('tt0097925', 2, 'Die Frau deines Lebens - Die Verr?ckte', 'XWG', NULL, NULL, NULL, 0),
('tt0097925', 3, 'La mujer lun?tica', 'ES', NULL, NULL, NULL, 0),
('tt0097925', 4, 'La mujer lun?tica', NULL, NULL, 'original', NULL, 1),
('tt0098987', 1, 'Ford Fairlane - Rock\'n\' Roll Detective', 'XWG', NULL, NULL, NULL, 0),
('tt0098987', 2, 'Ford Fairlane: polic?a del mundo rock', 'PE', NULL, 'imdbDisplay', NULL, 0),
('tt0098987', 3, 'Ford Fairlane', 'PL', NULL, 'alternative', NULL, 0),
('tt0098987', 4, '????????????? ?? ???? ????????', 'BG', 'bg', 'imdbDisplay', NULL, 0),
('tt0098987', 5, 'The Adventures of Ford Fairlane', 'CA', 'en', 'imdbDisplay', NULL, 0),
('tt0098987', 6, 'The Adventures of Ford Fairlane', 'US', NULL, 'imdbDisplay', NULL, 0),
('tt0098987', 7, 'Ford Fairlane', 'NO', NULL, 'imdbDisplay', NULL, 0),
('tt0098987', 8, 'Ford Fairlane: Rock\'n Roll Dedektifi', 'TR', 'tr', 'imdbDisplay', NULL, 0),
('tt0098987', 9, 'Ford Fairlane: Rock\'n Roll Detective', 'FR', NULL, 'alternative', NULL, 0),
('tt0098987', 11, 'The Adventures of Ford Fairlane', 'AU', NULL, 'imdbDisplay', NULL, 0),
('tt0098987', 12, 'Las aventuras de Ford Fairlane', 'ES', NULL, 'imdbDisplay', NULL, 0),
('tt0098987', 13, 'Przygody Forda Fairlane\'a', 'PL', NULL, 'imdbDisplay', NULL, 0),
('tt0098987', 14, 'The Adventures of Ford Fairlane', NULL, NULL, 'original', NULL, 1),
('tt0098987', 15, 'Ford Fairlane - rokkidekkari', 'FI', NULL, NULL, NULL, 0),
('tt0098987', 16, '??????????????', 'JP', 'ja', 'imdbDisplay', NULL, 0),
('tt0098987', 17, 'Ford Fairlane', 'SE', NULL, NULL, 'theatrical title', 0),
('tt0098987', 18, '??????? ????? ????????', 'UA', NULL, 'imdbDisplay', NULL, 0),
('tt0098987', 19, 'Les aventures de Ford Fairlane', 'FR', NULL, 'imdbDisplay', NULL, 0),
('tt0098987', 20, 'The Adventures of Ford Fairlane', 'CA', 'fr', 'imdbDisplay', NULL, 0),
('tt0098987', 21, 'Le avventure di Ford Fairlane', 'IT', NULL, NULL, NULL, 0),
('tt0098987', 22, 'Ford Fairlane - Rock\'n\' Roll Detective', 'DE', NULL, 'imdbDisplay', NULL, 0),
('tt0098987', 23, 'As Aventuras de Ford Fairlane', 'BR', NULL, 'imdbDisplay', NULL, 0),
('tt0098987', 24, 'Ford Fairlane - rock \'n\' roll detektiv', 'DK', NULL, 'imdbDisplay', NULL, 0),
('tt0098987', 25, 'The Adventures of Ford Fairlane', 'GB', NULL, 'imdbDisplay', NULL, 0),
('tt0098987', 26, 'Ford Fairlane kalandjai', 'HU', NULL, NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `episode`
--

CREATE TABLE `episode` (
  `tconst` varchar(20) NOT NULL,
  `parentTconst` varchar(20) NOT NULL,
  `seasonNumber` int(5) DEFAULT NULL,
  `episodeNumber` int(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `episode`
--

INSERT INTO `episode` (`tconst`, `parentTconst`, `seasonNumber`, `episodeNumber`) VALUES
('tt0034841', 'tt0095670', 1, 7),
('tt0097925', 'tt0095670', 1, 7);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `genre`
--

CREATE TABLE `genre` (
  `tconst` varchar(20) NOT NULL,
  `genre` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `genre`
--

INSERT INTO `genre` (`tconst`, `genre`) VALUES
('tt0034841', 'Animation'),
('tt0034841', 'Short'),
('tt0040844', 'Short'),
('tt0040844', 'Western'),
('tt0095670', 'Comedy'),
('tt0095670', 'Romance'),
('tt0097924', 'Comedy'),
('tt0097924', 'Romance'),
('tt0097925', 'Comedy'),
('tt0097925', 'Romance'),
('tt0098987', 'Action'),
('tt0098987', 'Adventure'),
('tt0098987', 'Comedy');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `knowfortitles`
--

CREATE TABLE `knowfortitles` (
  `nconst` varchar(20) NOT NULL,
  `tconst` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `knowfortitles`
--

INSERT INTO `knowfortitles` (`nconst`, `tconst`) VALUES
('nm0001048', 'tt0098987'),
('nm0001636', 'tt0098987'),
('nm0036714', 'tt0098987'),
('nm0135470', 'tt0098987'),
('nm0628611', 'tt0098987'),
('nm0675305', 'tt0098987'),
('nm0858659', 'tt0040844'),
('nm0918266', 'tt0098987');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `people`
--

CREATE TABLE `people` (
  `nconst` varchar(20) NOT NULL,
  `primaryName` varchar(255) DEFAULT NULL,
  `birthYear` year(4) DEFAULT NULL,
  `deathYear` year(4) DEFAULT NULL,
  `img_url_asset` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `people`
--

INSERT INTO `people` (`nconst`, `primaryName`, `birthYear`, `deathYear`, `img_url_asset`) VALUES
('nm0001048', 'Andrew Dice Clay', 1957, NULL, 'https://image.tmdb.org/t/p/{width_variable}/kq6APbPUbx0Mzoh6mK7k8Xoiw5m.jpg'),
('nm0001636', 'Priscilla Presley', 1945, NULL, 'https://image.tmdb.org/t/p/{width_variable}/qS3o1a2rIUS2suDVtEkpCvj6T6Q.jpg'),
('nm0036714', 'David Arnott', 1963, NULL, 'https://image.tmdb.org/t/p/{width_variable}/wx6KwmPvnn3A1x2MtImlt55fPAK.jpg'),
('nm0135470', 'James Cappe', NULL, NULL, NULL),
('nm0628611', 'Wayne Newton', 1942, NULL, 'https://image.tmdb.org/t/p/{width_variable}/v888Enog3fIBHXO5jYSS09BvJIj.jpg'),
('nm0675305', 'Steve Perry', NULL, NULL, NULL),
('nm0858659', 'Crawford John Thomas', 1929, 1998, NULL),
('nm0918266', 'Rex Weiner', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `primaryprofession`
--

CREATE TABLE `primaryprofession` (
  `nconst` varchar(20) NOT NULL,
  `profession` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `primaryprofession`
--

INSERT INTO `primaryprofession` (`nconst`, `profession`) VALUES
('nm0001048', 'actor'),
('nm0001048', 'producer'),
('nm0001048', 'writer'),
('nm0001636', 'actress'),
('nm0001636', 'producer'),
('nm0001636', 'writer'),
('nm0036714', 'actor'),
('nm0036714', 'miscellaneous'),
('nm0036714', 'writer'),
('nm0135470', 'producer'),
('nm0135470', 'script_department'),
('nm0135470', 'writer'),
('nm0628611', 'actor'),
('nm0628611', 'producer'),
('nm0628611', 'soundtrack'),
('nm0675305', 'assistant_director'),
('nm0675305', 'producer'),
('nm0675305', 'production_manager'),
('nm0858659', 'actor'),
('nm0858659', 'producer'),
('nm0918266', 'miscellaneous'),
('nm0918266', 'writer');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `principals`
--

CREATE TABLE `principals` (
  `nconst` varchar(20) NOT NULL,
  `tconst` varchar(20) NOT NULL,
  `ordering` int(5) DEFAULT NULL,
  `category` varchar(30) DEFAULT NULL,
  `job` varchar(70) DEFAULT NULL,
  `characters` varchar(70) DEFAULT NULL,
  `img_url_asset` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `principals`
--

INSERT INTO `principals` (`nconst`, `tconst`, `ordering`, `category`, `job`, `characters`, `img_url_asset`) VALUES
('nm0001048', 'tt0098987', 1, 'actor', NULL, 'Ford Fairlane', 'https://image.tmdb.org/t/p/{width_variable}/kq6APbPUbx0Mzoh6mK7k8Xoiw5m.jpg'),
('nm0001636', 'tt0098987', 4, 'actress', NULL, 'Colleen Sutton', 'https://image.tmdb.org/t/p/{width_variable}/qS3o1a2rIUS2suDVtEkpCvj6T6Q.jpg'),
('nm0036714', 'tt0098987', 8, 'writer', 'screenplay', NULL, 'https://image.tmdb.org/t/p/{width_variable}/wx6KwmPvnn3A1x2MtImlt55fPAK.jpg'),
('nm0135470', 'tt0098987', 7, 'writer', 'screenplay', NULL, NULL),
('nm0628611', 'tt0098987', 3, 'actor', NULL, 'Julian Grendel', 'https://image.tmdb.org/t/p/{width_variable}/v888Enog3fIBHXO5jYSS09BvJIj.jpg'),
('nm0675305', 'tt0098987', 10, 'producer', 'producer', NULL, NULL),
('nm0858659', 'tt0040844', 6, 'producer', 'producer', NULL, NULL),
('nm0918266', 'tt0098987', 9, 'writer', 'characters', NULL, NULL);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `rating`
--

CREATE TABLE `rating` (
  `tconst` varchar(20) NOT NULL,
  `averageRating` float DEFAULT NULL,
  `numVotes` int(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `rating`
--

INSERT INTO `rating` (`tconst`, `averageRating`, `numVotes`) VALUES
('tt0034841', 6.3, 282),
('tt0040844', 3.3, 189),
('tt0097924', 6.1, 14),
('tt0097925', 6, 22),
('tt0098987', 6.4, 18855);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `title`
--

CREATE TABLE `title` (
  `tconst` varchar(20) NOT NULL,
  `titleType` varchar(20) DEFAULT NULL,
  `primaryTitle` varchar(255) DEFAULT NULL,
  `originalTitle` varchar(255) DEFAULT NULL,
  `isAdult` tinyint(1) DEFAULT NULL,
  `startYear` year(4) DEFAULT NULL,
  `endYear` year(4) DEFAULT NULL,
  `runtimeMinutes` int(5) DEFAULT NULL,
  `img_url_asset` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `title`
--

INSERT INTO `title` (`tconst`, `titleType`, `primaryTitle`, `originalTitle`, `isAdult`, `startYear`, `endYear`, `runtimeMinutes`, `img_url_asset`) VALUES
('tt0034841', 'short', 'Hen Hop', 'Hen Hop', 0, 1994, NULL, 4, 'https://image.tmdb.org/t/p/{width_variable}/88EH2TVg6fGK7SnGXcfQ05MD2Rk.jpg'),
('tt0040844', 'short', 'Crossroads of Laredo', 'Crossroads of Laredo', 0, 1995, NULL, 30, 'https://image.tmdb.org/t/p/{width_variable}/atrGjxMSp6y4jvs7nojUrlsGFUb.jpg'),
('tt0095670', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'https://image.tmdb.org/t/p/{width_variable}/o0GFTzMjcwdWRcK1Vxd3pDFht8s.jpg'),
('tt0097924', 'tvEpisode', 'La mujer inesperada', 'La mujer inesperada', 0, 1990, NULL, 56, 'https://image.tmdb.org/t/p/{width_variable}/o0GFTzMjcwdWRcK1Vxd3pDFht8s.jpg'),
('tt0097925', 'tvEpisode', 'La mujer lun‚?tica', 'La mujer lun‚?tica', 0, 1990, NULL, 60, 'https://image.tmdb.org/t/p/{width_variable}/o0GFTzMjcwdWRcK1Vxd3pDFht8s.jpg'),
('tt0098987', 'movie', 'The Adventures of Ford Fairlane', 'The Adventures of Ford Fairlane', 0, 1990, NULL, 104, 'https://image.tmdb.org/t/p/{width_variable}/u6accimG7LmroR8WgNklEJS7oFq.jpg');

--
-- Ευρετήρια για άχρηστους πίνακες
--

--
-- Ευρετήρια για πίνακα `akas`
--
ALTER TABLE `akas`
  ADD PRIMARY KEY (`tconst`,`ordering`);

--
-- Ευρετήρια για πίνακα `episode`
--
ALTER TABLE `episode`
  ADD PRIMARY KEY (`tconst`,`parentTconst`),
  ADD KEY `parentTconst` (`parentTconst`);

--
-- Ευρετήρια για πίνακα `genre`
--
ALTER TABLE `genre`
  ADD PRIMARY KEY (`tconst`,`genre`);

--
-- Ευρετήρια για πίνακα `knowfortitles`
--
ALTER TABLE `knowfortitles`
  ADD PRIMARY KEY (`nconst`,`tconst`),
  ADD KEY `tconst` (`tconst`);

--
-- Ευρετήρια για πίνακα `people`
--
ALTER TABLE `people`
  ADD PRIMARY KEY (`nconst`);

--
-- Ευρετήρια για πίνακα `primaryprofession`
--
ALTER TABLE `primaryprofession`
  ADD PRIMARY KEY (`nconst`,`profession`);

--
-- Ευρετήρια για πίνακα `principals`
--
ALTER TABLE `principals`
  ADD PRIMARY KEY (`nconst`,`tconst`),
  ADD KEY `tconst` (`tconst`);

--
-- Ευρετήρια για πίνακα `rating`
--
ALTER TABLE `rating`
  ADD PRIMARY KEY (`tconst`);

--
-- Ευρετήρια για πίνακα `title`
--
ALTER TABLE `title`
  ADD PRIMARY KEY (`tconst`);

--
-- Περιορισμοί για άχρηστους πίνακες
--

--
-- Περιορισμοί για πίνακα `akas`
--
ALTER TABLE `akas`
  ADD CONSTRAINT `akas_ibfk_1` FOREIGN KEY (`tconst`) REFERENCES `title` (`tconst`);

--
-- Περιορισμοί για πίνακα `episode`
--
ALTER TABLE `episode`
  ADD CONSTRAINT `episode_ibfk_1` FOREIGN KEY (`tconst`) REFERENCES `title` (`tconst`),
  ADD CONSTRAINT `episode_ibfk_2` FOREIGN KEY (`parentTconst`) REFERENCES `title` (`tconst`);

--
-- Περιορισμοί για πίνακα `genre`
--
ALTER TABLE `genre`
  ADD CONSTRAINT `genre_ibfk_1` FOREIGN KEY (`tconst`) REFERENCES `title` (`tconst`);

--
-- Περιορισμοί για πίνακα `knowfortitles`
--
ALTER TABLE `knowfortitles`
  ADD CONSTRAINT `knowfortitles_ibfk_1` FOREIGN KEY (`nconst`) REFERENCES `people` (`nconst`),
  ADD CONSTRAINT `knowfortitles_ibfk_2` FOREIGN KEY (`tconst`) REFERENCES `title` (`tconst`);

--
-- Περιορισμοί για πίνακα `primaryprofession`
--
ALTER TABLE `primaryprofession`
  ADD CONSTRAINT `primaryprofession_ibfk_1` FOREIGN KEY (`nconst`) REFERENCES `people` (`nconst`);

--
-- Περιορισμοί για πίνακα `principals`
--
ALTER TABLE `principals`
  ADD CONSTRAINT `principals_ibfk_1` FOREIGN KEY (`nconst`) REFERENCES `people` (`nconst`),
  ADD CONSTRAINT `principals_ibfk_2` FOREIGN KEY (`tconst`) REFERENCES `title` (`tconst`);

--
-- Περιορισμοί για πίνακα `rating`
--
ALTER TABLE `rating`
  ADD CONSTRAINT `rating_ibfk_1` FOREIGN KEY (`tconst`) REFERENCES `title` (`tconst`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
