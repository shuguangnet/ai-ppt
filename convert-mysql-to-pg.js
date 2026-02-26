/**
 * MySQL to PostgreSQL Migration Script (修复版)
 */

const fs = require('fs');

const inputFile = '/Users/shuguang/Desktop/project/sql/sql.sql';
const outputFile = '/Users/shuguang/Desktop/project/sql/postgresql.sql';

let content = fs.readFileSync(inputFile, 'utf-8');

// 1. 移除MySQL特定的注释和设置
content = content
  .replace(/-- MySQL dump.*/g, '')
  .replace(/-- Host:.*/g, '')
  .replace(/-- ------------------------------------------------------.*/g, '')
  .replace(/-- Server version.*/g, '')
  .replace(/\/\*!40101 SET @OLD_CHARACTER_SET_CLIENT.*?\*\/;/g, '')
  .replace(/\/\*!40101 SET @OLD_CHARACTER_SET_RESULTS.*?\*\/;/g, '')
  .replace(/\/\*!40101 SET @OLD_COLLATION_CONNECTION.*?\*\/;/g, '')
  .replace(/\/\*!40101 SET NAMES utf8mb4 \*\/;/g, '')
  .replace(/\/\*!40103 SET @OLD_TIME_ZONE.*?\*\/;/g, '')
  .replace(/\/\*!40103 SET TIME_ZONE='\+00:00' \*\/;/g, '')
  .replace(/\/\*!40014 SET @OLD_UNIQUE_CHECKS.*?\*\/;/g, '')
  .replace(/\/\*!40014 SET @OLD_FOREIGN_KEY_CHECKS.*?\*\/;/g, '')
  .replace(/\/\*!40101 SET @OLD_SQL_MODE.*?\*\/;/g, '')
  .replace(/\/\*!40111 SET @OLD_SQL_NOTES.*?\*\/;/g, '')
  .replace(/\/\*!40101 SET @saved_cs_client.*?;/g, '')
  .replace(/\/\*!40101 SET character_set_client.*?;/g, '')
  .replace(/LOCK TABLES.*WRITE;/g, '')
  .replace(/\/\*!40000 ALTER TABLE.*DISABLE KEYS \*\/;/g, '')
  .replace(/\/\*!40000 ALTER TABLE.*ENABLE KEYS \*\/;/g, '')
  .replace(/UNLOCK TABLES;/g, '')
  .replace(/-- Dumping events for database.*/g, '')
  .replace(/-- Dumping routines for database.*/g, '')
  .replace(/-- Dump completed.*/g, '');

// 2. 处理表结构部分
content = content.replace(/-- Table structure for table `(\w+)`/g, (_, tableName) => `-- Table: ${tableName}`);
content = content.replace(/-- Dumping data for table `(\w+)`/g, '');

// 3. 转换表创建语句 - 反引号转双引号
content = content.replace(/`(\w+)`/g, '"$1"');

// 4. 修复被破坏的引号（连续的双引号）
content = content.replace(/""/g, '"');

// 5. 转换数据类型
content = content.replace(/datetime NOT NULL DEFAULT CURRENT_TIMESTAMP/g, 'timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP');
content = content.replace(/datetime DEFAULT CURRENT_TIMESTAMP/g, 'timestamp DEFAULT CURRENT_TIMESTAMP');
content = content.replace(/datetime NOT NULL/g, 'timestamp NOT NULL');
content = content.replace(/datetime DEFAULT NULL/g, 'timestamp DEFAULT NULL');

// 6. 转换 json -> jsonb
content = content.replace(/"result" json DEFAULT NULL/g, '"result" jsonb DEFAULT NULL');
content = content.replace(/"result" json NOT NULL/g, '"result" jsonb NOT NULL');
content = content.replace(/"params" json DEFAULT NULL/g, '"params" jsonb DEFAULT NULL');
content = content.replace(/"params" json NOT NULL/g, '"params" jsonb NOT NULL');
content = content.replace(/"price_config" json DEFAULT NULL/g, '"price_config" jsonb DEFAULT NULL');
content = content.replace(/"site_config" json DEFAULT NULL/g, '"site_config" jsonb DEFAULT NULL');
content = content.replace(/"payload" json DEFAULT NULL/g, '"payload" jsonb DEFAULT NULL');
content = content.replace(/"payload" json NOT NULL/g, '"payload" jsonb NOT NULL');
content = content.replace(/"filters" json DEFAULT NULL/g, '"filters" jsonb DEFAULT NULL');
content = content.replace(/"encryption" json DEFAULT NULL/g, '"encryption" jsonb DEFAULT NULL');
content = content.replace(/"compression" json DEFAULT NULL/g, '"compression" jsonb DEFAULT NULL');
content = content.replace(/"retention" json DEFAULT NULL/g, '"retention" jsonb DEFAULT NULL');
content = content.replace(/"schedule" json DEFAULT NULL/g, '"schedule" jsonb DEFAULT NULL');
content = content.replace(/"errors" json DEFAULT NULL/g, '"errors" jsonb DEFAULT NULL');
content = content.replace(/"progress" json DEFAULT NULL/g, '"progress" jsonb DEFAULT NULL');
content = content.replace(/"file_data" json DEFAULT NULL/g, '"file_data" jsonb DEFAULT NULL');
content = content.replace(/"permissions" json DEFAULT NULL/g, '"permissions" jsonb DEFAULT NULL');
content = content.replace(/"events" json DEFAULT NULL/g, '"events" jsonb DEFAULT NULL');
content = content.replace(/"source_paths" json DEFAULT NULL/g, '"source_paths" jsonb DEFAULT NULL');
content = content.replace(/"summary_notification_config" json DEFAULT NULL/g, '"summary_notification_config" jsonb DEFAULT NULL');

// 7. 转换 tinyint(1) 为 boolean
content = content.replace(/tinyint\(1\) NOT NULL DEFAULT '1'/g, 'boolean NOT NULL DEFAULT true');
content = content.replace(/tinyint\(1\) NOT NULL DEFAULT '0'/g, 'boolean NOT NULL DEFAULT false');
content = content.replace(/tinyint\(1\) DEFAULT '1'/g, 'boolean DEFAULT true');
content = content.replace(/tinyint\(1\) DEFAULT '0'/g, 'boolean DEFAULT false');
content = content.replace(/tinyint\(1\) NOT NULL/g, 'boolean NOT NULL');
content = content.replace(/tinyint\(1\)/g, 'boolean');

// 8. 转换 int 和 bigint
content = content.replace(/int\(11\)/g, 'integer');
content = content.replace(/bigint\(20\)/g, 'bigint');

// 9. 移除MySQL特定的引擎和字符集设置
content = content.replace(/ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;/g, ';');
content = content.replace(/ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;/g, ';');
content = content.replace(/DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;/g, ';');
content = content.replace(/COLLATE utf8mb4_unicode_ci/g, '');

// 10. 修复索引定义 - 使用 INDEX 替代 KEY
content = content.replace(/KEY "idx_/g, 'INDEX "idx_');
content = content.replace(/KEY "/g, 'INDEX "');

// 11. 处理外键引用
content = content.replace(/REFERENCES "(\w+)"\("(\w+)"\)/g, 'REFERENCES "$1" ("$2")');

// 12. 处理复合主键和索引中的括号
content = content.replace(/\("(\w+)", "(\w+)"\)/g, '("$1", "$2")');

// 13. 修复 ON UPDATE（PostgreSQL不支持，需要触发器）
content = content.replace(/ON UPDATE CURRENT_TIMESTAMP/g, '');

// 14. 清理多余空行
content = content.replace(/\n{3,}/g, '\n\n');

// 15. 修复decimal默认值 - 保持原样，PostgreSQL接受带引号的数字
content = content.replace(/decimal\(10,2\) NOT NULL DEFAULT '(\d+\.\d+)'/g, "decimal(10,2) NOT NULL DEFAULT '$1'");

// 16. 修复 integer 默认值
content = content.replace(/integer NOT NULL DEFAULT '(\d+)'/g, "integer NOT NULL DEFAULT $1");

// 17. 移除末尾的逗号（在右括号前的逗号）
content = content.replace(/,\s*\n\s*\)/g, '\n)');

// 18. 修复 bigint 默认值（去掉引号）
content = content.replace(/bigint DEFAULT '(\d+)'/g, 'bigint DEFAULT $1');

// 19. 修复末尾多余的空格和逗号
content = content.replace(/ ,/g, ',');

fs.writeFileSync(outputFile, content, 'utf-8');

console.log('转换完成！');
console.log(`输入文件: ${inputFile}`);
console.log(`输出文件: ${outputFile}`);
