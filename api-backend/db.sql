-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Εξυπηρετητής: 127.0.0.1
-- Χρόνος δημιουργίας: 25 Ιαν 2024 στις 14:05:41
-- Έκδοση διακομιστή: 10.4.27-MariaDB
-- Έκδοση PHP: 8.2.0
-- Έκδοση PHP: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Βάση δεδομένων: `tl`
--

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `akas`
--

CREATE TABLE `akas` (
  `titleId` varchar(20) NOT NULL,
  `ordering` int(5) NOT NULL,
  `title` varchar(255) NOT NULL,
  `region` varchar(5) NOT NULL,
  `language` varchar(5) NOT NULL,
  `types` varchar(20) NOT NULL,
  `attributes` varchar(50) NOT NULL,
  `isOriginalTitle` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `crewdirectors`
--

CREATE TABLE `crewdirectors` (
  `tconst` varchar(20) NOT NULL,
  `directors` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `crewwriters`
--

CREATE TABLE `crewwriters` (
  `tconst` varchar(20) NOT NULL,
  `writers` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `episode`
--

CREATE TABLE `episode` (
  `tconst` varchar(20) NOT NULL,
  `parentTconst` varchar(20) NOT NULL,
  `seasonNumber` int(5) NOT NULL,
  `episodeNumber` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `genre`
--

CREATE TABLE `genre` (
  `tconst` varchar(20) NOT NULL,
  `genres` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `knowfortitles`
--

CREATE TABLE `knowfortitles` (
  `nconst` varchar(20) NOT NULL,
  `knownForTitles` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `people`
--

CREATE TABLE `people` (
  `nconst` varchar(20) NOT NULL,
  `primaryName` varchar(255) NOT NULL,
  `birthYear` year(4) NOT NULL,
  `deathYear` year(4) NOT NULL,
  `img_url_asset` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `primaryprofession`
--

CREATE TABLE `primaryprofession` (
  `nconst` varchar(20) NOT NULL,
  `primaryProfession` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `principals`
--

CREATE TABLE `principals` (
  `nconst` varchar(20) NOT NULL,
  `tconst` varchar(20) NOT NULL,
  `ordering` int(5) NOT NULL,
  `category` varchar(30) NOT NULL,
  `job` varchar(70) NOT NULL,
  `characters` varchar(70) NOT NULL,
  `img_url_asset` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `rating`
--

CREATE TABLE `rating` (
  `tconst` varchar(20) NOT NULL,
  `averageRating` float NOT NULL,
  `numVotes` int(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `title`
--

CREATE TABLE `title` (
  `tconst` varchar(20) NOT NULL,
  `titleType` varchar(20) NOT NULL,
  `primaryTitle` varchar(255) NOT NULL,
  `originalTitle` varchar(255) NOT NULL,
  `isAdult` tinyint(1) NOT NULL,
  `startYear` year(4) NOT NULL,
  `endYear` year(4) NOT NULL,
  `runtimeMinutes` int(5) NOT NULL,
  `img_url_asset` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Ευρετήρια για άχρηστους πίνακες
--

--
-- Ευρετήρια για πίνακα `akas`
--
ALTER TABLE `akas`
  ADD PRIMARY KEY (`titleId`,`ordering`);

--
-- Ευρετήρια για πίνακα `crewdirectors`
--
ALTER TABLE `crewdirectors`
  ADD PRIMARY KEY (`tconst`,`directors`),
  ADD KEY `directors` (`directors`);

--
-- Ευρετήρια για πίνακα `crewwriters`
--
ALTER TABLE `crewwriters`
  ADD PRIMARY KEY (`tconst`,`writers`),
  ADD KEY `writers` (`writers`);

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
  ADD PRIMARY KEY (`nconst`,`tconst`,`category`),
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
-- Περιορισμοί για πίνακα `crewdirectors`
--
ALTER TABLE `crewdirectors`
  ADD CONSTRAINT `crewdirectors_ibfk_1` FOREIGN KEY (`tconst`) REFERENCES `title` (`tconst`),
  ADD CONSTRAINT `crewdirectors_ibfk_2` FOREIGN KEY (`directors`) REFERENCES `people` (`nconst`);

--
-- Περιορισμοί για πίνακα `crewwriters`
--
ALTER TABLE `crewwriters`
  ADD CONSTRAINT `crewwriters_ibfk_1` FOREIGN KEY (`tconst`) REFERENCES `title` (`tconst`),
  ADD CONSTRAINT `crewwriters_ibfk_2` FOREIGN KEY (`writers`) REFERENCES `people` (`nconst`);

--
-- Περιορισμοί για πίνακα `episode`
--
ALTER TABLE `episode`
  ADD CONSTRAINT `episode_ibfk_1` FOREIGN KEY (`tconst`) REFERENCES `title` (`tconst`),
  -- ADD CONSTRAINT `episode_ibfk_2` FOREIGN KEY (`parentTconst`) REFERENCES `title` (`tconst`);

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
