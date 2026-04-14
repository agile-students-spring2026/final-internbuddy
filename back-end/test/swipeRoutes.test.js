const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../src/app');

describe('Swipe Routes', () => {
  it('GET /api/swipe/profiles should return an array of profiles', async () => {
    const res = await request(app).get('/api/swipe/profiles');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.greaterThan(0);
    expect(res.body[0]).to.have.property('name');
    expect(res.body[0]).to.have.property('internshipFull');
    expect(res.body[0]).to.have.property('age');
    expect(res.body[0]).to.have.property('swipeImage');
  });

  it('GET /api/swipe/profiles should not include the current user', async () => {
    const res = await request(app)
      .get('/api/swipe/profiles')
      .set('x-current-user-id', '101');
    expect(res.status).to.equal(200);
    const ids = res.body.map(p => p.id);
    expect(ids).to.not.include('101');
  });

  it('GET /api/swipe/profiles should not include connected users', async () => {
    // user 1 is connected to user 2 (seeded in connectionsStore)
    const res = await request(app)
      .get('/api/swipe/profiles')
      .set('x-current-user-id', '1');
    expect(res.status).to.equal(200);
    const ids = res.body.map(p => p.id);
    expect(ids).to.not.include('2');
  });
});
