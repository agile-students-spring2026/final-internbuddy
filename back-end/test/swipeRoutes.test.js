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
  });

  it('POST /api/swipe/like should record a like', async () => {
    const res = await request(app)
      .post('/api/swipe/like')
      .send({ profileId: 1 });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('liked', 1);
  });

  it('POST /api/swipe/pass should record a pass', async () => {
    const res = await request(app)
      .post('/api/swipe/pass')
      .send({ profileId: 2 });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('passed', 2);
  });

  it('POST /api/swipe/like should return 400 without profileId', async () => {
    const res = await request(app)
      .post('/api/swipe/like')
      .send({});
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error');
  });

  it('GET /api/swipe/requests should return received and sent', async () => {
    const res = await request(app).get('/api/swipe/requests');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('received');
    expect(res.body).to.have.property('sent');
    expect(res.body.received).to.be.an('array');
  });
});
