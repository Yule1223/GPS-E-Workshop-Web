-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 21, 2021 at 04:26 PM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `E-Workshop`
--

-- --------------------------------------------------------

--
-- Table structure for table `cliente`
--

CREATE TABLE `cliente` (
  `id` int(11) NOT NULL,
  `telefono` varchar(12) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `dni` varchar(9) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `cliente`
--

INSERT INTO `cliente` (`id`, `telefono`, `nombre`, `apellido`, `dni`, `activo`) VALUES
(1, '688100111', 'Yule', 'Zhang', '49936323B', 1),
(2, '982819675', 'Valentina', 'Garrido', '05248784T', 1),
(3, '974459314', 'Higinio', 'Velez', '88764856J', 1);

-- --------------------------------------------------------

--
-- Table structure for table `empleado`
--

CREATE TABLE `empleado` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `dni` varchar(9) NOT NULL,
  `telefono` varchar(12) NOT NULL,
  `tipo` enum('administrativo','jefe de taller','mecanico','') NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `empleado`
--

INSERT INTO `empleado` (`id`, `nombre`, `apellido`, `email`, `password`, `dni`, `telefono`, `tipo`, `activo`) VALUES
(1, 'e-workshop', 'admin', 'administrativo@ews.com', '1234', '82322305S', '969109270', 'administrativo', 1),
(2, 'José', 'Velasco', 'jVelasco@ews.com', '1234', '26041562L', '987304169', 'jefe de taller', 1),
(3, 'Juan', 'Carlos', 'jCarlos@ews.com', '1234', '56719732F', '925762857', 'mecanico', 1);

-- --------------------------------------------------------

--
-- Table structure for table `orden_reparacion`
--

CREATE TABLE `orden_reparacion` (
  `id` int(11) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `id_empleado` int(11) NOT NULL,
  `id_vehiculo` int(11) NOT NULL,
  `codigo` int(6) NOT NULL,
  `fecha_hora` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `orden_reparacion`
--

INSERT INTO `orden_reparacion` (`id`, `activo`, `id_empleado`, `id_vehiculo`, `codigo`, `fecha_hora`) VALUES
(2, 1, 3, 1, 1, '2021-04-21 14:25:49');

-- --------------------------------------------------------

--
-- Table structure for table `vehiculo`
--

CREATE TABLE `vehiculo` (
  `id` int(11) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `matricula` varchar(7) NOT NULL,
  `bastidor` varchar(20) NOT NULL,
  `velocidad_carga` float NOT NULL,
  `kms` int(7) NOT NULL,
  `capacidad_carga` float NOT NULL,
  `potencia` float NOT NULL,
  `id_cliente` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `vehiculo`
--

INSERT INTO `vehiculo` (`id`, `activo`, `matricula`, `bastidor`, `velocidad_carga`, `kms`, `capacidad_carga`, `potencia`, `id_cliente`) VALUES
(1, 1, '0293EWK', 'VSSZZZ6KZ1R149943', 444.44, 18373, 888.43, 5757, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dni` (`dni`);

--
-- Indexes for table `empleado`
--
ALTER TABLE `empleado`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dni` (`dni`);

--
-- Indexes for table `orden_reparacion`
--
ALTER TABLE `orden_reparacion`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Código_UNIQUE` (`codigo`),
  ADD KEY `foreign_empleado` (`id_empleado`),
  ADD KEY `foreign_vehiculo` (`id_vehiculo`);

--
-- Indexes for table `vehiculo`
--
ALTER TABLE `vehiculo`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `matricula` (`matricula`),
  ADD UNIQUE KEY `bastidor` (`bastidor`),
  ADD KEY `foreign_cliente` (`id_cliente`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cliente`
--
ALTER TABLE `cliente`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `empleado`
--
ALTER TABLE `empleado`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `orden_reparacion`
--
ALTER TABLE `orden_reparacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `vehiculo`
--
ALTER TABLE `vehiculo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orden_reparacion`
--
ALTER TABLE `orden_reparacion`
  ADD CONSTRAINT `foreign_empleado` FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `foreign_vehiculo` FOREIGN KEY (`id_vehiculo`) REFERENCES `vehiculo` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `vehiculo`
--
ALTER TABLE `vehiculo`
  ADD CONSTRAINT `foreign_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
