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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-07 23:34:15
