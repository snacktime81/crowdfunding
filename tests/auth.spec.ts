import request from 'supertest';
import {postUser} from "../controllers/auth";
import {pool, setupTestDatabase, cleanupTestDatabase, dropDB} from "../models/testdb";
import {user} from "../types/model";
import {app} from '../src/app';


describe('POST /join', () => {
	beforeAll(async() => {
		return await setupTestDatabase();
	});
	afterAll(async() => {
		return await cleanupTestDatabase();
	})
	test('성공시', async() => {
		await request(app)
		.post('/auth/join')
		.send({name: 'test2',
			   email: 'test2@test.com',
			   password: 'testpw2'
			  })
		.expect(302);
	});
	test('이미 계정이 생성되어 있을때', async() => {
		await request(app)
		.post('/auth/join')
		.send({name: 'test2',
			   email: 'test2@test.com',
			   password: 'testpw2'
			  })
		.expect(409);
	});
});