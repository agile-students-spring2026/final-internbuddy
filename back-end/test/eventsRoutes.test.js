const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const Event = require('../src/models/Event');

describe('Events Routes', function () {
  this.timeout(30000);

  const testUserId = new mongoose.Types.ObjectId();
  let token;
  let createdEventId;

  before(async function () {
    await mongoose.connect(process.env.MONGO_URI);
    token = jwt.sign({ sub: String(testUserId), email: 'eventtest@test.com' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  after(async function () {
    await Event.deleteMany({ createdBy: testUserId });
    await mongoose.disconnect();
  });

  it('GET /api/events should return an array of events', async () => {
    const res = await request(app).get('/api/events');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('POST /api/events without auth should return 401', async () => {
    const res = await request(app)
      .post('/api/events')
      .send({ title: 'No Auth Event' });
    expect(res.status).to.equal(401);
  });

  it('POST /api/events should return 400 without title', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send({ location: 'NYC' });
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error');
  });

  it('POST /api/events should create a new event', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Event', location: 'NYC', date: '2026-06-01', time: '5:00 PM' });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
    expect(res.body).to.have.property('title', 'Test Event');
    expect(res.body).to.have.property('location', 'NYC');
    expect(res.body).to.have.property('privacy', 'public');
    createdEventId = res.body.id;
  });

  it('GET /api/events/:id should return a single event', async () => {
    const res = await request(app).get(`/api/events/${createdEventId}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('id', createdEventId);
    expect(res.body).to.have.property('title', 'Test Event');
  });

  it('GET /api/events/:id should return 404 for unknown id', async () => {
    const res = await request(app).get(`/api/events/${new mongoose.Types.ObjectId()}`);
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property('error');
  });

  it('GET /api/events/:id should return 404 for invalid id format', async () => {
    const res = await request(app).get('/api/events/not-a-valid-id');
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property('error');
  });

  it('GET /api/events/me without auth should return 401', async () => {
    const res = await request(app).get('/api/events/me');
    expect(res.status).to.equal(401);
  });

  it('GET /api/events/me should return user events with all categories', async () => {
    const res = await request(app)
      .get('/api/events/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('hosting').that.is.an('array');
    expect(res.body).to.have.property('attending').that.is.an('array');
    expect(res.body).to.have.property('private').that.is.an('array');
    expect(res.body).to.have.property('suggested').that.is.an('array');
    expect(res.body.hosting.some(e => e.id === createdEventId)).to.equal(true);
  });
});
