-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: recetario
-- ------------------------------------------------------
-- Server version	8.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ingredientes`
--

DROP TABLE IF EXISTS `ingredientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ingredientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredientes`
--

LOCK TABLES `ingredientes` WRITE;
/*!40000 ALTER TABLE `ingredientes` DISABLE KEYS */;
INSERT INTO `ingredientes` VALUES (3,'aceite'),(7,'huevos'),(2,'leche'),(4,'Mantequilla');
/*!40000 ALTER TABLE `ingredientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receta_ingredientes`
--

DROP TABLE IF EXISTS `receta_ingredientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `receta_ingredientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `receta_id` int NOT NULL,
  `ingrediente_id` int NOT NULL,
  `cantidad` int DEFAULT NULL,
  `unidad` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `receta_id` (`receta_id`),
  KEY `ingrediente_id` (`ingrediente_id`),
  CONSTRAINT `receta_ingredientes_ibfk_1` FOREIGN KEY (`receta_id`) REFERENCES `recetas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `receta_ingredientes_ibfk_2` FOREIGN KEY (`ingrediente_id`) REFERENCES `ingredientes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receta_ingredientes`
--

LOCK TABLES `receta_ingredientes` WRITE;
/*!40000 ALTER TABLE `receta_ingredientes` DISABLE KEYS */;
/*!40000 ALTER TABLE `receta_ingredientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recetas`
--

DROP TABLE IF EXISTS `recetas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recetas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(200) NOT NULL,
  `preparacion` text NOT NULL,
  `url_imagen` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recetas`
--

LOCK TABLES `recetas` WRITE;
/*!40000 ALTER TABLE `recetas` DISABLE KEYS */;
INSERT INTO `recetas` VALUES (3,'Completo Italiano','Paso a paso:\n\nPreparar el tomate: Pela los tomates, córtalos en cubos pequeños , elimina el exceso de líquido y sazona con sal y un chorrito de aceite.\n\nPreparar la palta: Extrae la pulpa de la palta, ponla en un bol, añade sal y muévela hasta formar una pasta semi-gruesa.\n\nCalentar la vienesa: Hierve las vienesas en agua durante 3 a 5 minutos. Para darle un toque extra, puedes dorarlas en un sartén con una gota de aceite.\n\nCalentar el pan: Abre los panes por la mitad y caliéntalos al vapor o tuéstalos ligeramente en el horno.\n\nEl armado perfecto:\n- Pon la vienesa caliente dentro del pan\n- Agrega el tomate picado sobre la vienesa\n- Cubre el tomate con la pasta de palta\n- Corona con abundante mayonesa en la parte superior','http://192.168.1.10:3001/uploads/recetas/completos.jpg'),(4,'Sopa de Macaco','Iaaaaaaa','http://192.168.1.10:3001/uploads/recetas/sopamacaco.jpg'),(5,'Tallarines con queso rallado','hervir awa, hacer los tallarines , toma tallarines y rallale queso','http://192.168.1.10:3001/uploads/recetas/tallarines_queso.jpg'),(6,'Tortilla de papas','Batir los huevos, cortar las papas en rodajas, freír las papas, mezclar con los huevos, cocinar en sartén.','');
/*!40000 ALTER TABLE `recetas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sequelizemeta`
--

LOCK TABLES `sequelizemeta` WRITE;
/*!40000 ALTER TABLE `sequelizemeta` DISABLE KEYS */;
INSERT INTO `sequelizemeta` VALUES ('20260531012235-create-recetas.js'),('20260531013339-create-usuarios.js');
/*!40000 ALTER TABLE `sequelizemeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` varchar(20) DEFAULT 'usuario',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Daniel Prueba','daniel@gmail.com','$2b$10$Tm5bJFKaB7.PkG4lFUMz/O9JEOp5qUZwBCqwBd7S3/34hC9AVoAQK','desarrollador','2026-06-08 02:32:29','2026-06-08 03:19:55'),(2,'Usuario Test','test@ejemplo.com','$2b$10$cSgFxFUKdAdlYsn8/l7/veJkCMNbyGZuIOjJcTgqIeGWWDrQq8sum','usuario','2026-06-08 02:41:26','2026-06-08 02:41:26');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-07 23:36:09
