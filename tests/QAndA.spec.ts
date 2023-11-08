import request from 'supertest';
import {postUser} from "../controllers/auth";
import {pool, setupTestDatabase, cleanupTestDatabase, dropDB} from "../models/testdb";
import {app} from '../src/app';

import { FieldPacket } from "mysql2/promise";
import {user} from "../types/model";



describe('GET /FAQ', () => {
	beforeAll(async() => {
		await setupTestDatabase();
		await pool.query('INSERT INTO USER(email, name, password) VALUES("test@test.com", "TESTN", "TESTPW")')
		
		const [rows, fields] : [user[], FieldPacket[]] = await pool.query("SELECT id FROM USER");
		const userId = rows[0].id;
		
		await pool.query('INSERT INTO Q_AND_A(user_id, question, answer, respondent) VALUES(?, "TEST", "yes", 20)', userId)
		
		const [qs, fields2] : [any[], FieldPacket[]] = await pool.query("SELECT id FROM Q_AND_A");
		const qId = qs[0].id;
		
		await pool.query('INSERT INTO FAQ(qa_id, user_id) VALUES(?, ?)', [qId, userId]);
	});
	afterAll(async() => {
		await cleanupTestDatabase();
	})
	test('성공시', async() => {
		await request(app)
		.get('/FAQ')
		.expect(200)
		.expect({faq_id:1, qusetion:'TEST', answer: 'yes', respondent:20 })
	});
});
