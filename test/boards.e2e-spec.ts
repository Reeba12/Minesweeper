import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { v4 as uuidv4 } from 'uuid';

describe('Boards API (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should create a board', async () => {
        const payload = {
            email: 'test@example.com',
            board_name: `Test Board - ${uuidv4()}`,
            width: Math.floor(Math.random() * 5) + 1,
            height: Math.floor(Math.random() * 5) + 1,
            mines: Math.floor(Math.random() * (Math.floor(Math.random() * 5) + 1) * Math.floor(Math.random() * 5) + 1),
        };

        const res = await request(app.getHttpServer())
            .post('/boards')
            .send(payload)
            .expect(201);

        console.log('Response:', res.body);

        expect(res.body).toHaveProperty('id');
        expect(res.body.email).toBe(payload.email);
        expect(res.body.board_name).toBe(payload.board_name);
        expect(res.body.generated_board).toBeInstanceOf(Array);
        expect(res.body.generated_board.length).toBe(payload.height);
        expect(res.body.generated_board[0].length).toBe(payload.width);
        expect(res.body).toHaveProperty('created_at');
    });

    it('should return 10 most recent boards', async () => {
        const res = await request(app.getHttpServer())
            .get('/boards/recent')
            .expect(200);

        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeLessThanOrEqual(10);

        console.log('Recent Boards:', res.body);

        if (res.body.length > 0) {
            const board = res.body[0];
            expect(board).toHaveProperty('id');
            expect(board).toHaveProperty('email');
            expect(board).toHaveProperty('board_name');
            expect(board).toHaveProperty('created_at');
        }
    });

    it('should return all boards (default pagination)', async () => {
        const res = await request(app.getHttpServer())
            .get('/boards')
            .expect(200);

        console.log('All Boards:', res.body);

        expect(res.body).toHaveProperty('boards');
        expect(Array.isArray(res.body.boards)).toBe(true);
        expect(res.body).toHaveProperty('total');
        expect(res.body).toHaveProperty('page');
        expect(res.body).toHaveProperty('perPage');
    });

    it('should return paginated boards', async () => {
        const res = await request(app.getHttpServer())
            .get('/boards?page=1&perPage=2')
            .expect(200);

        console.log('Paginated Boards:', res.body);

        expect(res.body).toHaveProperty('boards');
        expect(Array.isArray(res.body.boards)).toBe(true);
        expect(res.body.page).toBe(1);
        expect(res.body.perPage).toBe(2);
        expect(res.body.boards.length).toBeLessThanOrEqual(2);
    });

    it('should search boards by board_name', async () => {
        // First, create a board with a unique name
        const uniqueName = `SearchTest-${Date.now()}`;
        await request(app.getHttpServer())
            .post('/boards')
            .send({
                email: 'search@example.com',
                board_name: uniqueName,
                width: 3,
                height: 3,
                mines: 2,
            })
            .expect(201);

        // Now, search for it
        const res = await request(app.getHttpServer())
            .get(`/boards?board_name=${uniqueName}`)
            .expect(200);

        console.log('Search Results:', res.body);

        expect(res.body.boards.length).toBeGreaterThan(0);
        expect(res.body.boards[0].board_name).toBe(uniqueName);
    });

    it('should return empty boards if no boards match search', async () => {
        const res = await request(app.getHttpServer())
            .get('/boards?board_name=NoSuchBoardName123456')
            .expect(200);

        expect(Array.isArray(res.body.boards)).toBe(true);
        expect(res.body.boards.length).toBe(0);
    });
});
