const request = require('supertest');
const { expect } = require('chai');

const app = require('../src/app');

describe('Connections routes', () => {

  describe('POST /api/connections/request', () => {
    it('should send a connection request and return 201', async () => {
      const res = await request(app)
        .post('/api/connections/request')
        .send({ fromUserId: '10', toUserId: '11' });

      expect(res.status).to.equal(201);
      expect(res.body.request).to.have.property('id');
      expect(res.body.request.status).to.equal('pending');
      expect(res.body.request.fromUserId).to.equal('10');
      expect(res.body.request.toUserId).to.equal('11');
    });

    it('should return 400 if fromUserId is missing', async () => {
      const res = await request(app)
        .post('/api/connections/request')
        .send({ toUserId: '11' });

      expect(res.status).to.equal(400);
    });

    it('should return 400 if toUserId is missing', async () => {
      const res = await request(app)
        .post('/api/connections/request')
        .send({ fromUserId: '10' });

      expect(res.status).to.equal(400);
    });
  });

  describe('GET /api/connections/:userId/pending', () => {
    it('should return pending requests for a user', async () => {
      // user 1 has seeded pending requests from users 3 and 4
      const res = await request(app).get('/api/connections/1/pending');

      expect(res.status).to.equal(200);
      expect(res.body.pending).to.be.an('array');
      expect(res.body.pending.length).to.be.at.least(1);
    });

    it('should return empty array for user with no pending requests', async () => {
      const res = await request(app).get('/api/connections/999/pending');

      expect(res.status).to.equal(200);
      expect(res.body.pending).to.deep.equal([]);
    });
  });

  describe('GET /api/connections/:userId/sent', () => {
    it('should return sent pending requests for a user', async () => {
      const send = await request(app)
        .post('/api/connections/request')
        .send({ fromUserId: '50', toUserId: '51' });

      const res = await request(app).get('/api/connections/50/sent');

      expect(res.status).to.equal(200);
      expect(res.body.sent).to.be.an('array');
      expect(res.body.sent.length).to.be.at.least(1);
      expect(res.body.sent[0]).to.have.property('toUser');
    });

    it('should return empty array for user with no sent requests', async () => {
      const res = await request(app).get('/api/connections/999/sent');
      expect(res.status).to.equal(200);
      expect(res.body.sent).to.deep.equal([]);
    });
  });

  describe('GET /api/connections/:userId', () => {
    it('should return accepted connections for a user', async () => {
      // user 1 has a seeded accepted connection with user 2
      const res = await request(app).get('/api/connections/1');

      expect(res.status).to.equal(200);
      expect(res.body.accepted).to.be.an('array');
      expect(res.body.accepted.length).to.be.at.least(1);
    });
  });

  describe('POST /api/connections/:requestId/accept', () => {
    it('should accept a pending request', async () => {
      // first send a new request so we have an id to accept
      const send = await request(app)
        .post('/api/connections/request')
        .send({ fromUserId: '20', toUserId: '21' });

      const requestId = send.body.request.id;

      const res = await request(app).post(`/api/connections/${requestId}/accept`);

      expect(res.status).to.equal(200);
      expect(res.body.request.status).to.equal('accepted');
    });

    it('should return 404 if request does not exist', async () => {
      const res = await request(app).post('/api/connections/9999/accept');
      expect(res.status).to.equal(404);
    });
  });

  describe('POST /api/connections/:requestId/reject', () => {
    it('should reject a pending request', async () => {
      const send = await request(app)
        .post('/api/connections/request')
        .send({ fromUserId: '30', toUserId: '31' });

      const requestId = send.body.request.id;

      const res = await request(app).post(`/api/connections/${requestId}/reject`);

      expect(res.status).to.equal(200);
      expect(res.body.request.status).to.equal('rejected');
    });
  });

  describe('DELETE /api/connections/:requestId', () => {
    it('should delete a connection', async () => {
      const send = await request(app)
        .post('/api/connections/request')
        .send({ fromUserId: '40', toUserId: '41' });

      const requestId = send.body.request.id;

      const res = await request(app).delete(`/api/connections/${requestId}`);

      expect(res.status).to.equal(200);
      expect(res.body.deleted).to.have.property('id', requestId);
    });

    it('should return 404 if connection does not exist', async () => {
      const res = await request(app).delete('/api/connections/9999');
      expect(res.status).to.equal(404);
    });
  });

});
