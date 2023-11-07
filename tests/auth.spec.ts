import request from 'supertest';
import {postUser} from "../controllers/auth";
import {pool, setupTestDatabase, cleanupTestDatabase, dropDB} from "../models/testdb";
import {user} from "../types/model";
import {app} from '../src/app';


describe('POST /join', () => {
	beforeAll(async() => {
		await setupTestDatabase();
	});
	afterAll(async() => {
		await cleanupTestDatabase();
	})
	test('성공시', (done) => {
		request(app)
		.post('/auth/join')
		.send({name: 'test2',
			   email: 'test2@test.com',
			   password: 'testpw2'
			  })
		.expect(302, done);
	});
	test
});