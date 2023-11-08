import mysql from 'mysql2/promise';
import configObj from '../config/config.js';

const testDbConfig = configObj['test'];

const pool = mysql.createPool(testDbConfig);


async function setupTestDatabase() {
	try {
		
		await pool.query(`
		CREATE TABLE IF NOT EXISTS USER (
        id INT NOT NULL,
        email VARCHAR(40) NOT NULL,
        name VARCHAR(40) NOT NULL,
        password VARCHAR(100) NOT NULL,
        authority VARCHAR(10) NOT NULL DEFAULT 'common'
      );
    `);

		// ITEM 테이블 생성
		await pool.query(`
      CREATE TABLE IF NOT EXISTS ITEM (
        id INT,
        user_id INT NOT NULL,
        name VARCHAR(10) NOT NULL,
        price INT NOT NULL,
        percent INT NOT NULL,
        explanation VARCHAR(100),
        img VARCHAR(100),
        deadline DATE NOT NULL,
        views INT DEFAULT 0
      );
    `);

		// ORDER 테이블 생성
		await pool.query(`
      CREATE TABLE IF NOT EXISTS \`ORDER\` (
        id INT,
        idea_id INT NOT NULL,
        user_id INT NOT NULL,
        date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        purchase_percent INT NOT NULL,
        price INT NOT NULL
      );
    `);
		// 다른 테이블에 대한 CREATE TABLE 쿼리 예시

		// Q_AND_A 테이블
		await pool.query(`
	  CREATE TABLE IF NOT EXISTS Q_AND_A (
		id INT,
		user_id INT NOT NULL,
		question VARCHAR(200) NOT NULL,
		answer VARCHAR(500),
		respondent INT
	  );
	`);

		// FAQ 테이블
		await pool.query(`
	  CREATE TABLE IF NOT EXISTS FAQ (
		faq_id INT,
		qa_id INT NOT NULL,
		user_id INT NOT NULL
	  );
	`);

		// CART 테이블
		await pool.query(`
	  CREATE TABLE IF NOT EXISTS CART (
		id INT,
		user_id INT NOT NULL
	  );
	`);

		// CART_ITEM 테이블
		await pool.query(`
	  CREATE TABLE IF NOT EXISTS CART_ITEM (
		cart_id INT NOT NULL,
		user_id INT NOT NULL,
		item_id INT NOT NULL,
		num INT NOT NULL DEFAULT 1
	  );
	`);
		
		// await pool.query('ALTER TABLE `USER` ADD CONSTRAINT `PK_USER` PRIMARY KEY (`id`);');
		// await pool.query('ALTER TABLE `ITEM` ADD CONSTRAINT `PK_ITEM` PRIMARY KEY (`id`,`user_id`);');
		// await pool.query('ALTER TABLE `ORDER` ADD CONSTRAINT `PK_ORDER` PRIMARY KEY (`id`,`idea_id`,`user_id`);');
		// await pool.query('ALTER TABLE `Q_AND_A` ADD CONSTRAINT `PK_Q_AND_A` PRIMARY KEY (`id`,`user_id`);');
		// await pool.query('ALTER TABLE `FAQ` ADD CONSTRAINT `PK_FAQ` PRIMARY KEY (`faq_id`,`qa_id`,`user_id`);');
		// await pool.query('ALTER TABLE `CART` ADD CONSTRAINT `PK_CART` PRIMARY KEY (`id`,`user_id`);');
		// await pool.query('ALTER TABLE `CART_ITEM` ADD CONSTRAINT `PK_CART_ITEM` PRIMARY KEY (`cart_id`,`user_id`,`item_id`);');

		// await pool.query('ALTER TABLE USER MODIFY id INT NOT NULL AUTO_INCREMENT;');
		// await pool.query('ALTER TABLE ITEM MODIFY id INT NOT NULL AUTO_INCREMENT;');
		// await pool.query('ALTER TABLE `ORDER` MODIFY id INT NOT NULL AUTO_INCREMENT;');
		// await pool.query('ALTER TABLE Q_AND_A MODIFY id INT NOT NULL AUTO_INCREMENT;');
		// await pool.query('ALTER TABLE FAQ MODIFY faq_id INT NOT NULL AUTO_INCREMENT;');
		// await pool.query('ALTER TABLE CART MODIFY id INT NOT NULL AUTO_INCREMENT;');

		// // 4. 외래 키 설정 (FOREIGN KEY)
		// await pool.query(
		// 	'ALTER TABLE `ITEM` ADD CONSTRAINT `FK_USER_TO_ITEM_1` FOREIGN KEY (`user_id`) REFERENCES `USER` (`id`);'
		// );
		// await pool.query(
		// 	'ALTER TABLE `ORDER` ADD CONSTRAINT FK_ITEM_TO_ORDER_1 FOREIGN KEY (idea_id) REFERENCES ITEM (id);'
		// );
		// await pool.query(
		// 	'ALTER TABLE `ORDER` ADD CONSTRAINT FK_ITEM_TO_ORDER_2 FOREIGN KEY (user_id) REFERENCES ITEM (user_id);'
		// );
		// await pool.query(
		// 	`ALTER TABLE Q_AND_A ADD CONSTRAINT FK_USER_TO_Q_AND_A_1 FOREIGN KEY (user_id) REFERENCES USER (id);`
		// );
		// await pool.query(
		// 	`ALTER TABLE FAQ ADD CONSTRAINT FK_Q_AND_A_TO_FAQ_1 FOREIGN KEY (qa_id) REFERENCES Q_AND_A (id);`
		// );
		// await pool.query(
		// 	`ALTER TABLE FAQ ADD CONSTRAINT FK_Q_AND_A_TO_FAQ_2 FOREIGN KEY (user_id) REFERENCES Q_AND_A (user_id);`
		// );
		// await pool.query(
		// 	`ALTER TABLE CART ADD CONSTRAINT FK_USER_TO_CART_1 FOREIGN KEY (user_id) REFERENCES USER (id);`
		// );
		// await pool.query(
		// 	`ALTER TABLE CART_ITEM ADD CONSTRAINT FK_CART_TO_CART_ITEM_1 FOREIGN KEY (cart_id) REFERENCES CART (id);`
		// );
		// await pool.query(
		// 	`ALTER TABLE CART_ITEM ADD CONSTRAINT FK_CART_TO_CART_ITEM_2 FOREIGN KEY (user_id) REFERENCES CART (user_id);`
		// );
		// await pool.query(
		// 	`ALTER TABLE CART_ITEM ADD CONSTRAINT FK_ITEM_TO_CART_ITEM_1 FOREIGN KEY (item_id) REFERENCES ITEM (id);`
		// );
		

	} finally {
	}
}

async function cleanupTestDatabase() {
	try {

		await pool.query('SET FOREIGN_KEY_CHECKS = 0;');
		await pool.query('DELETE FROM USER');
		await pool.query('DELETE FROM ITEM');
		await pool.query('DELETE FROM `ORDER`');
		await pool.query('DELETE FROM Q_AND_A');
		await pool.query('DELETE FROM FAQ');
		await pool.query('DELETE FROM CART');
		await pool.query('DELETE FROM CART_ITEM');
		await pool.query('SET FOREIGN_KEY_CHECKS = 1;');
	} finally {
	}
}

async function dropDB() {
	await pool.query('DROP DATABASE startfunding_test');
;
}

export { pool, setupTestDatabase, cleanupTestDatabase, dropDB };