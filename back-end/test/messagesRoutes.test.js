const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../src/app');

describe('Messages Routes', () => {
  it('GET /api/messages should return an array of conversations', async () => {
    const res = await request(app).get('/api/messages');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.greaterThan(0);
    expect(res.body[0]).to.have.property('id');
    expect(res.body[0]).to.have.property('otherUser');
    expect(res.body[0]).to.have.property('lastMessage');
  });

  it('GET /api/messages/:conversationId should return conversation and messages', async () => {
    const res = await request(app).get('/api/messages/c1');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('conversation');
    expect(res.body).to.have.property('messages');
    expect(res.body.messages).to.be.an('array');
    expect(res.body.messages.length).to.be.greaterThan(0);
  });

  it('GET /api/messages/:conversationId should return 404 for unknown id', async () => {
    const res = await request(app).get('/api/messages/c999');
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property('error');
  });

  it('POST /api/messages/:conversationId should send a message', async () => {
    const res = await request(app)
      .post('/api/messages/c1')
      .send({ text: 'Hello from test!' });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
    expect(res.body).to.have.property('sender', 'me');
    expect(res.body).to.have.property('text', 'Hello from test!');
  });

  it('POST /api/messages/:conversationId should return 400 without text', async () => {
    const res = await request(app)
      .post('/api/messages/c1')
      .send({});
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error');
  });

  it('POST /api/messages should create a new conversation', async () => {
    const res = await request(app)
      .post('/api/messages')
      .send({ userId: '1', otherUserId: '103' });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
    expect(res.body.otherUser).to.have.property('name', 'Alex');
    expect(res.body.otherUser).to.have.property('id', 'u103');
  });

  it('POST /api/messages should return 400 if userId is missing', async () => {
    const res = await request(app)
      .post('/api/messages')
      .send({ otherUserId: '103' });
    expect(res.status).to.equal(400);
  });

  it('POST /api/messages should return 400 if otherUserId is missing', async () => {
    const res = await request(app)
      .post('/api/messages')
      .send({ userId: '1' });
    expect(res.status).to.equal(400);
  });

  it('POST /api/messages should return existing conversation for duplicate pair', async () => {
    const first = await request(app)
      .post('/api/messages')
      .send({ userId: '1', otherUserId: '104' });
    const second = await request(app)
      .post('/api/messages')
      .send({ userId: '1', otherUserId: '104' });
    expect(first.body.id).to.equal(second.body.id);
  });

  it('GET /api/messages/:id should work for a newly created conversation', async () => {
    const created = await request(app)
      .post('/api/messages')
      .send({ userId: '1', otherUserId: '105' });
    const res = await request(app).get(`/api/messages/${created.body.id}`);
    expect(res.status).to.equal(200);
    expect(res.body.messages).to.deep.equal([]);
  });
});
