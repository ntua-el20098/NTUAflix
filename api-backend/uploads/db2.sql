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
  `titleId` varchar(20) NOT NULL,
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


-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `genre`
--

CREATE TABLE `genre` (
  `tconst` varchar(20) NOT NULL,
  `genres` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `genre`
--


-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `knowfortitles`
--

CREATE TABLE `knowfortitles` (
  `nconst` varchar(20) NOT NULL,
  `knownForTitles` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `knowfortitles`
--

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

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `primaryprofession`
--

CREATE TABLE `primaryprofession` (
  `nconst` varchar(20) NOT NULL,
  `primaryProfession` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `primaryprofession`
--

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

--
-- Ευρετήρια για άχρηστους πίνακες
--

--
-- Ευρετήρια για πίνακα `akas`
--
ALTER TABLE `akas`
  ADD PRIMARY KEY (`titleId`,`ordering`);

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
  ADD PRIMARY KEY (`tconst`,`genres`);

--
-- Ευρετήρια για πίνακα `knowfortitles`
--
ALTER TABLE `knowfortitles`
  ADD PRIMARY KEY (`nconst`,`knownForTitles`),
  ADD KEY `knownForTitles` (`knownForTitles`);

--
-- Ευρετήρια για πίνακα `people`
--
ALTER TABLE `people`
  ADD PRIMARY KEY (`nconst`);

--
-- Ευρετήρια για πίνακα `primaryprofession`
--
ALTER TABLE `primaryprofession`
  ADD PRIMARY KEY (`nconst`,`primaryProfession`);

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
  ADD CONSTRAINT `akas_ibfk_1` FOREIGN KEY (`titleId`) REFERENCES `title` (`tconst`);

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
  ADD CONSTRAINT `knowfortitles_ibfk_2` FOREIGN KEY (`knownForTitles`) REFERENCES `title` (`tconst`);

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
