const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../src/app');

describe('Events Routes', () => {
  it('GET /api/events should return an array of events', async () => {
    const res = await request(app).get('/api/events');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.greaterThan(0);
    expect(res.body[0]).to.have.property('title');
    expect(res.body[0]).to.have.property('id');
  });

  it('GET /api/events/:id should return a single event', async () => {
    const res = await request(app).get('/api/events/e1');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('id', 'e1');
    expect(res.body).to.have.property('title');
  });

  it('GET /api/events/:id should return 404 for unknown id', async () => {
    const res = await request(app).get('/api/events/e999');
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property('error');
  });

  it('POST /api/events should create a new event', async () => {
    const res = await request(app)
      .post('/api/events')
      .send({ title: 'Test Event', location: 'NYC', date: '2026-06-01', time: '5:00 PM' });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
    expect(res.body).to.have.property('title', 'Test Event');
    expect(res.body).to.have.property('location', 'NYC');
  });

  it('GET /api/events/me should return user events with all categories', async () => {
    const res = await request(app).get('/api/events/me');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('hosting').that.is.an('array');
    expect(res.body).to.have.property('attending').that.is.an('array');
    expect(res.body).to.have.property('private').that.is.an('array');
    expect(res.body).to.have.property('suggested').that.is.an('array');
  });

  it('POST /api/events should return 400 without title', async () => {
    const res = await request(app)
      .post('/api/events')
      .send({ location: 'NYC' });
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error');
  });
});
