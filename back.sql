-- --------------------------------------------------------
-- 主机:                           qdm203823661.my3w.com
-- 服务器版本:                        5.1.73 - Source distribution
-- 服务器操作系统:                      unknown-linux-gnu
-- HeidiSQL 版本:                  9.3.0.4984
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- 导出 qdm203823661_db 的数据库结构
CREATE DATABASE IF NOT EXISTS `qdm203823661_db` /*!40100 DEFAULT CHARACTER SET gbk */;
USE `qdm203823661_db`;


-- 导出  表 qdm203823661_db.note 结构
CREATE TABLE IF NOT EXISTS `note` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(50) DEFAULT NULL,
  `note` text,
  `status` int(11) DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=gbk;

-- 数据导出被取消选择。


-- 导出  表 qdm203823661_db.token 结构
CREATE TABLE IF NOT EXISTS `token` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(50) DEFAULT NULL,
  `token` text,
  `refreshtoken` text,
  `time` datetime DEFAULT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=gbk;

-- 数据导出被取消选择。


-- 导出  表 qdm203823661_db.user 结构
CREATE TABLE IF NOT EXISTS `user` (
  `name` char(50) DEFAULT NULL,
  `password` char(50) DEFAULT NULL,
  `registertime` datetime DEFAULT NULL,
  `logintime` datetime DEFAULT NULL,
  `avatar` char(150) DEFAULT NULL,
  `vip` int(11) DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='testuser';

-- 数据导出被取消选择。
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
