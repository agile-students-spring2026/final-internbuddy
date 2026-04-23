const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const Swipe = require('../src/models/Swipe');

describe('Swipe Routes', function () {
  this.timeout(30000);

  const testUserId = new mongoose.Types.ObjectId();
  let token;

  before(async function () {
    token = jwt.sign({ sub: String(testUserId), email: 'swipetest@test.com' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  after(async function () {
    await Swipe.deleteMany({ userId: testUserId });
  });

  it('GET /api/swipe/profiles without auth returns 401', async () => {
    const res = await request(app).get('/api/swipe/profiles');
    expect(res.status).to.equal(401);
  });

  it('GET /api/swipe/profiles returns an array of profiles with auth', async () => {
    const res = await request(app)
      .get('/api/swipe/profiles')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.greaterThan(0);
    expect(res.body[0]).to.have.property('name');
  });

  it('POST /api/swipe/like without auth returns 401', async () => {
    const res = await request(app)
      .post('/api/swipe/like')
      .send({ profileId: '101' });
    expect(res.status).to.equal(401);
  });

  it('POST /api/swipe/like without profileId returns 400', async () => {
    const res = await request(app)
      .post('/api/swipe/like')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error');
  });

  it('POST /api/swipe/like records a like', async () => {
    const res = await request(app)
      .post('/api/swipe/like')
      .set('Authorization', `Bearer ${token}`)
      .send({ profileId: '101' });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('action', 'like');
    expect(res.body).to.have.property('targetProfileId', '101');
  });

  it('POST /api/swipe/pass records a pass', async () => {
    const res = await request(app)
      .post('/api/swipe/pass')
      .set('Authorization', `Bearer ${token}`)
      .send({ profileId: '102' });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('action', 'pass');
    expect(res.body).to.have.property('targetProfileId', '102');
  });

  it('GET /api/swipe/profiles filters out already-swiped profiles', async () => {
    const res = await request(app)
      .get('/api/swipe/profiles')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    const returnedIds = res.body.map((p) => String(p.id));
    expect(returnedIds).to.not.include('101');
    expect(returnedIds).to.not.include('102');
  });

  it('GET /api/swipe/history returns this user\'s swipe actions', async () => {
    const res = await request(app)
      .get('/api/swipe/history')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    const ids = res.body.map((s) => s.targetProfileId);
    expect(ids).to.include('101');
    expect(ids).to.include('102');
  });

  it('GET /api/swipe/stats without auth returns 401', async () => {
    const res = await request(app).get('/api/swipe/stats');
    expect(res.status).to.equal(401);
  });

  it('GET /api/swipe/stats returns like and pass counts with total', async () => {
    const res = await request(app)
      .get('/api/swipe/stats')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('likes').that.is.a('number');
    expect(res.body).to.have.property('passes').that.is.a('number');
    expect(res.body).to.have.property('total', res.body.likes + res.body.passes);
    expect(res.body.likes).to.be.at.least(1);
    expect(res.body.passes).to.be.at.least(1);
  });

  it('POST /api/swipe/like is idempotent (same profile twice)', async () => {
    const res = await request(app)
      .post('/api/swipe/like')
      .set('Authorization', `Bearer ${token}`)
      .send({ profileId: '101' });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('action', 'like');
  });
});
