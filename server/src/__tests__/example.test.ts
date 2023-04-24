import request from 'supertest';
import app from '../app';
import type MessageResponse from '../interfaces/MessageResponse';

describe('Example', () => {
  it('should be true', () => {
    expect(true).toBe(true);
  });
});

describe('Test api', () => {
  describe('GET /api/test', () => {
    it('should return 200', async () => {
      const res = await request(app).get('/api/test');
      expect(res.status).toBe(200);
    });
    it('should return a message', async () => {
      const res = (await request(app).get('/api/test')) as { body: MessageResponse };
      expect(res.body.message).toBe('test');
    });
    it('should not contain "test" in the body response', async () => {
      const res = await request(app).get('/api/test');
      expect(res.body).not.toHaveProperty('test');
    });
  });
});
