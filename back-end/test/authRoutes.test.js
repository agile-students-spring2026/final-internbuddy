const request = require('supertest');
const { expect } = require('chai');

const app = require('../src/app');

describe('Auth routes', () => {
  it('creates a signup account', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'demo@internbuddy.app', phone: '+15551234567' });

    expect(response.status).to.equal(201);
    expect(response.body.account).to.have.property('userId');
    expect(response.body.account.email).to.equal('demo@internbuddy.app');
  });

  it('verifies a created account', async () => {
    const signup = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'verify@internbuddy.app', phone: '+15550001111' });

    const response = await request(app)
      .post('/api/auth/verify')
      .send({ userId: signup.body.account.userId, code: '123456' });

    expect(response.status).to.equal(200);
    expect(response.body.account.verified).to.equal(true);
  });
});
