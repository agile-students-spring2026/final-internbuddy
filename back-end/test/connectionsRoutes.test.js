const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = require('../src/app');
const Connection = require('../src/models/Connection');

describe('Connections routes', () => {
  const fromId = new mongoose.Types.ObjectId();
  const toId = new mongoose.Types.ObjectId();
  let fromToken;
  let toToken;

  before(async () => {
    fromToken = jwt.sign(
      { sub: String(fromId), email: 'from@conntest.internbuddy' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    toToken = jwt.sign(
      { sub: String(toId), email: 'to@conntest.internbuddy' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  afterEach(async () => {
    await Connection.deleteMany({
      $or: [
        { fromUserId: String(fromId) },
        { toUserId: String(fromId) },
        { fromUserId: String(toId) },
        { toUserId: String(toId) },
      ],
    });
  });

  describe('POST /api/connections/request', () => {
    it('should return 401 without auth', async () => {
      const res = await request(app)
        .post('/api/connections/request')
        .send({ toUserId: String(toId) });

      expect(res.status).to.equal(401);
    });

    it('should send a connection request and return 201', async () => {
      const res = await request(app)
        .post('/api/connections/request')
        .set('Authorization', `Bearer ${fromToken}`)
        .send({ toUserId: String(toId) });

      expect(res.status).to.equal(201);
      expect(res.body.request).to.have.property('id');
      expect(res.body.request.status).to.equal('pending');
      expect(res.body.request.fromUserId).to.equal(String(fromId));
      expect(res.body.request.toUserId).to.equal(String(toId));
    });

    it('should return 400 if toUserId is missing', async () => {
      const res = await request(app)
        .post('/api/connections/request')
        .set('Authorization', `Bearer ${fromToken}`)
        .send({});

      expect(res.status).to.equal(400);
    });

    it('should return 400 if toUserId is self', async () => {
      const res = await request(app)
        .post('/api/connections/request')
        .set('Authorization', `Bearer ${fromToken}`)
        .send({ toUserId: String(fromId) });

      expect(res.status).to.equal(400);
    });

    it('should return 409 for duplicate pending request', async () => {
      await request(app)
        .post('/api/connections/request')
        .set('Authorization', `Bearer ${fromToken}`)
        .send({ toUserId: String(toId) });

      const res = await request(app)
        .post('/api/connections/request')
        .set('Authorization', `Bearer ${fromToken}`)
        .send({ toUserId: String(toId) });

      expect(res.status).to.equal(409);
    });
  });

  describe('GET /api/connections/:userId/pending', () => {
    it('should return 401 without auth', async () => {
      const res = await request(app).get(`/api/connections/${String(toId)}/pending`);
      expect(res.status).to.equal(401);
    });

    it('should return pending requests for a user', async () => {
      await request(app)
        .post('/api/connections/request')
        .set('Authorization', `Bearer ${fromToken}`)
        .send({ toUserId: String(toId) });

      const res = await request(app)
        .get(`/api/connections/${String(toId)}/pending`)
        .set('Authorization', `Bearer ${toToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.pending).to.be.an('array');
      expect(res.body.pending.length).to.equal(1);
    });

    it('should return empty array for user with no pending requests', async () => {
      const otherId = new mongoose.Types.ObjectId();
      const otherToken = jwt.sign(
        { sub: String(otherId), email: 'other@conntest.internbuddy' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      const res = await request(app)
        .get(`/api/connections/${String(otherId)}/pending`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.pending).to.deep.equal([]);
    });
  });

  describe('GET /api/connections/:userId/sent', () => {
    it('should return 401 without auth', async () => {
      const res = await request(app).get(`/api/connections/${String(fromId)}/sent`);
      expect(res.status).to.equal(401);
    });

    it('should return sent pending requests for a user', async () => {
      await request(app)
        .post('/api/connections/request')
        .set('Authorization', `Bearer ${fromToken}`)
        .send({ toUserId: String(toId) });

      const res = await request(app)
        .get(`/api/connections/${String(fromId)}/sent`)
        .set('Authorization', `Bearer ${fromToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.sent).to.be.an('array');
      expect(res.body.sent.length).to.equal(1);
      expect(res.body.sent[0]).to.have.property('toUser');
    });

    it('should return empty array for user with no sent requests', async () => {
      const otherId = new mongoose.Types.ObjectId();
      const otherToken = jwt.sign(
        { sub: String(otherId), email: 'other2@conntest.internbuddy' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      const res = await request(app)
        .get(`/api/connections/${String(otherId)}/sent`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.sent).to.deep.equal([]);
    });
  });

  describe('GET /api/connections/:userId', () => {
    it('should return 401 without auth', async () => {
      const res = await request(app).get(`/api/connections/${String(fromId)}`);
      expect(res.status).to.equal(401);
    });

    it('should return accepted connections for a user', async () => {
      const send = await request(app)
        .post('/api/connections/request')
        .set('Authorization', `Bearer ${fromToken}`)
        .send({ toUserId: String(toId) });

      await request(app)
        .post(`/api/connections/${send.body.request.id}/accept`)
        .set('Authorization', `Bearer ${toToken}`);

      const res = await request(app)
        .get(`/api/connections/${String(fromId)}`)
        .set('Authorization', `Bearer ${fromToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.accepted).to.be.an('array');
      expect(res.body.accepted.length).to.equal(1);
    });
  });

  describe('POST /api/connections/:requestId/accept', () => {
    it('should return 401 without auth', async () => {
      const send = await request(app)
        .post('/api/connections/request')
        .set('Authorization', `Bearer ${fromToken}`)
        .send({ toUserId: String(toId) });

      const res = await request(app).post(`/api/connections/${send.body.request.id}/accept`);
      expect(res.status).to.equal(401);
    });

    it('should accept a pending request', async () => {
      const send = await request(app)
        .post('/api/connections/request')
        .set('Authorization', `Bearer ${fromToken}`)
        .send({ toUserId: String(toId) });

      const res = await request(app)
        .post(`/api/connections/${send.body.request.id}/accept`)
        .set('Authorization', `Bearer ${toToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.request.status).to.equal('accepted');
    });

    it('should include a conversation with otherUser in the accept response', async () => {
      const send = await request(app)
        .post('/api/connections/request')
        .set('Authorization', `Bearer ${fromToken}`)
        .send({ toUserId: String(toId) });

      const res = await request(app)
        .post(`/api/connections/${send.body.request.id}/accept`)
        .set('Authorization', `Bearer ${toToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('conversation');
      expect(res.body.conversation).to.have.property('id');
      expect(res.body.conversation).to.have.property('otherUser');
    });

    it('should return 404 if request does not exist', async () => {
      const res = await request(app)
        .post(`/api/connections/${new mongoose.Types.ObjectId()}/accept`)
        .set('Authorization', `Bearer ${fromToken}`);
      expect(res.status).to.equal(404);
    });

    it('should return 404 for invalid requestId format', async () => {
      const res = await request(app)
        .post('/api/connections/not-an-id/accept')
        .set('Authorization', `Bearer ${fromToken}`);
      expect(res.status).to.equal(404);
    });
  });

  describe('POST /api/connections/:requestId/reject', () => {
    it('should return 401 without auth', async () => {
      const send = await request(app)
        .post('/api/connections/request')
        .set('Authorization', `Bearer ${fromToken}`)
        .send({ toUserId: String(toId) });

      const res = await request(app).post(`/api/connections/${send.body.request.id}/reject`);
      expect(res.status).to.equal(401);
    });

    it('should reject a pending request', async () => {
      const send = await request(app)
        .post('/api/connections/request')
        .set('Authorization', `Bearer ${fromToken}`)
        .send({ toUserId: String(toId) });

      const res = await request(app)
        .post(`/api/connections/${send.body.request.id}/reject`)
        .set('Authorization', `Bearer ${toToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.request.status).to.equal('rejected');
    });
  });

  describe('DELETE /api/connections/:requestId', () => {
    it('should return 401 without auth', async () => {
      const send = await request(app)
        .post('/api/connections/request')
        .set('Authorization', `Bearer ${fromToken}`)
        .send({ toUserId: String(toId) });

      const res = await request(app).delete(`/api/connections/${send.body.request.id}`);
      expect(res.status).to.equal(401);
    });

    it('should delete a connection', async () => {
      const send = await request(app)
        .post('/api/connections/request')
        .set('Authorization', `Bearer ${fromToken}`)
        .send({ toUserId: String(toId) });

      const requestId = send.body.request.id;

      const res = await request(app)
        .delete(`/api/connections/${requestId}`)
        .set('Authorization', `Bearer ${fromToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.deleted).to.have.property('id', requestId);
    });

    it('should return 404 if connection does not exist', async () => {
      const res = await request(app)
        .delete(`/api/connections/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${fromToken}`);
      expect(res.status).to.equal(404);
    });

    it('should return 404 for invalid requestId format', async () => {
      const res = await request(app)
        .delete('/api/connections/not-an-id')
        .set('Authorization', `Bearer ${fromToken}`);
      expect(res.status).to.equal(404);
    });
  });
});
