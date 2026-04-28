const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const Conversation = require('../src/models/Conversation');
const User = require('../src/models/User');

describe('Messages Routes', function () {
  this.timeout(30000);

  let userA;
  let userB;
  let tokenA;
  let tokenB;
  let conversationId;

  before(async function () {
    userA = await User.create({
      email: `msgtest-a-${Date.now()}@test.com`,
      phone: '+15550000001',
      verified: true,
    });
    userB = await User.create({
      email: `msgtest-b-${Date.now()}@test.com`,
      phone: '+15550000002',
      verified: true,
    });

    tokenA = jwt.sign({ sub: String(userA._id), email: userA.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    tokenB = jwt.sign({ sub: String(userB._id), email: userB.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  after(async function () {
    await Conversation.deleteMany({ participants: { $in: [userA._id, userB._id] } });
    await User.deleteMany({ _id: { $in: [userA._id, userB._id] } });
  });

  it('GET /api/messages without auth returns 401', async () => {
    const res = await request(app).get('/api/messages');
    expect(res.status).to.equal(401);
  });

  it('GET /api/messages returns empty array when no conversations', async () => {
    const res = await request(app)
      .get('/api/messages')
      .set('Authorization', `Bearer ${tokenA}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('POST /api/messages without otherUserId returns 400', async () => {
    const res = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({});
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error');
  });

  it('POST /api/messages with invalid otherUserId returns 400', async () => {
    const res = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ otherUserId: 'not-a-valid-id' });
    expect(res.status).to.equal(400);
  });

  it('POST /api/messages with self as otherUserId returns 400', async () => {
    const res = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ otherUserId: String(userA._id) });
    expect(res.status).to.equal(400);
  });

  it('POST /api/messages with nonexistent user returns 404', async () => {
    const res = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ otherUserId: String(new mongoose.Types.ObjectId()) });
    expect(res.status).to.equal(404);
  });

  it('POST /api/messages creates a conversation', async () => {
    const res = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ otherUserId: String(userB._id) });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
    expect(res.body.otherUser).to.have.property('id', String(userB._id));
    conversationId = res.body.id;
  });

  it('POST /api/messages returns existing conversation on duplicate pair', async () => {
    const res = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ otherUserId: String(userB._id) });
    expect(res.status).to.equal(201);
    expect(res.body.id).to.equal(conversationId);
  });

  it('GET /api/messages returns the conversation for participant', async () => {
    const res = await request(app)
      .get('/api/messages')
      .set('Authorization', `Bearer ${tokenA}`);
    expect(res.status).to.equal(200);
    const ids = res.body.map((c) => c.id);
    expect(ids).to.include(conversationId);
  });

  it('POST /api/messages/:id without text returns 400', async () => {
    const res = await request(app)
      .post(`/api/messages/${conversationId}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({});
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error');
  });

  it('POST /api/messages/:id sends a message', async () => {
    const res = await request(app)
      .post(`/api/messages/${conversationId}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ text: 'Hello from A' });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('text', 'Hello from A');
    expect(res.body).to.have.property('sender', 'me');
  });

  it('GET /api/messages/:id shows messages with correct sender tags', async () => {
    await request(app)
      .post(`/api/messages/${conversationId}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ text: 'Hi back from B' });

    const res = await request(app)
      .get(`/api/messages/${conversationId}`)
      .set('Authorization', `Bearer ${tokenA}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('conversation');
    expect(res.body).to.have.property('messages').that.is.an('array');
    expect(res.body.messages).to.have.length.greaterThan(1);
    const senders = res.body.messages.map((m) => m.sender);
    expect(senders).to.include('me');
    expect(senders).to.include('them');
  });

  it('GET /api/messages/:id returns 403 for non-participant', async () => {
    const outsider = await User.create({
      email: `msgtest-outsider-${Date.now()}@test.com`,
      phone: '+15550000003',
      verified: true,
    });
    const outsiderToken = jwt.sign({ sub: String(outsider._id), email: outsider.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const res = await request(app)
      .get(`/api/messages/${conversationId}`)
      .set('Authorization', `Bearer ${outsiderToken}`);
    expect(res.status).to.equal(403);

    await User.deleteOne({ _id: outsider._id });
  });

  it('GET /api/messages/unread/count without auth returns 401', async () => {
    const res = await request(app).get('/api/messages/unread/count');
    expect(res.status).to.equal(401);
  });

  it('GET /api/messages/unread/count returns correct count for recipient', async () => {
    // tokenA read the conversation earlier, resetting their count to 0
    // tokenB received tokenA's message and has not read yet, so count should be >= 1
    const res = await request(app)
      .get('/api/messages/unread/count')
      .set('Authorization', `Bearer ${tokenB}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('count').that.is.a('number');
    expect(res.body.count).to.be.at.least(1);
  });

  it('reading a conversation resets the unread count to 0', async () => {
    await request(app)
      .get(`/api/messages/${conversationId}`)
      .set('Authorization', `Bearer ${tokenB}`);

    const res = await request(app)
      .get('/api/messages/unread/count')
      .set('Authorization', `Bearer ${tokenB}`);
    expect(res.status).to.equal(200);
    expect(res.body.count).to.equal(0);
  });

  it('POST /api/messages/:id rejects text over 2000 characters', async () => {
    const longText = 'x'.repeat(2001);
    const res = await request(app)
      .post(`/api/messages/${conversationId}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ text: longText });
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error');
  });

  it('POST /api/messages/:id accepts text at exactly 2000 characters', async () => {
    const exactText = 'y'.repeat(2000);
    const res = await request(app)
      .post(`/api/messages/${conversationId}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ text: exactText });
    expect(res.status).to.equal(201);
    expect(res.body.text).to.have.lengthOf(2000);
  });

  it('GET /api/messages/:id returns 404 for invalid id', async () => {
    const res = await request(app)
      .get('/api/messages/not-an-id')
      .set('Authorization', `Bearer ${tokenA}`);
    expect(res.status).to.equal(404);
  });

  it('GET /api/messages/:id returns 404 for nonexistent id', async () => {
    const res = await request(app)
      .get(`/api/messages/${new mongoose.Types.ObjectId()}`)
      .set('Authorization', `Bearer ${tokenA}`);
    expect(res.status).to.equal(404);
  });
});
