const request = require('supertest');
const { expect } = require('chai');

const app = require('../src/app');

describe('Auth routes', () => {
  it('validates register payload', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ email: 'not-an-email', phone: '', password: 'short' });

    expect(response.status).to.equal(400);
    expect(response.body.error).to.equal('Validation failed');
    expect(response.body.details).to.be.an('array').that.is.not.empty;
  });

  it('validates login payload', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'demo@internbuddy.app' });

    expect(response.status).to.equal(400);
    expect(response.body.error).to.equal('Validation failed');
    expect(response.body.details).to.be.an('array').that.is.not.empty;
  });

  it('requires bearer token on /api/auth/me', async () => {
    const response = await request(app)
      .get('/api/auth/me');

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('Authorization token is required');
  });

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

  it('rejects signup when email is missing', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({ phone: '+15551234567' });

    expect(response.status).to.equal(400);
    expect(response.body.error).to.equal('Missing required fields');
    expect(response.body.required).to.deep.equal(['email', 'phone']);
  });

  it('rejects signup when phone is missing', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'missingphone@internbuddy.app' });

    expect(response.status).to.equal(400);
    expect(response.body.error).to.equal('Missing required fields');
    expect(response.body.required).to.deep.equal(['email', 'phone']);
  });

  it('rejects duplicate signup emails', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({ email: 'dupe@internbuddy.app', phone: '+15550002222' });

    const response = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'dupe@internbuddy.app', phone: '+15550003333' });

    expect(response.status).to.equal(409);
    expect(response.body.error).to.equal('Account with this email already exists');
  });

  it('rejects duplicate signup emails regardless of case', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({ email: 'CaseTest@internbuddy.app', phone: '+15550004444' });

    const response = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'casetest@internbuddy.app', phone: '+15550005555' });

    expect(response.status).to.equal(409);
    expect(response.body.error).to.equal('Account with this email already exists');
  });

  it('rejects verify when userId is missing', async () => {
    const response = await request(app)
      .post('/api/auth/verify')
      .send({ code: '123456' });

    expect(response.status).to.equal(400);
    expect(response.body.error).to.equal('Missing required fields');
    expect(response.body.required).to.deep.equal(['userId', 'code']);
  });

  it('rejects verify when code is missing', async () => {
    const response = await request(app)
      .post('/api/auth/verify')
      .send({ userId: '1' });

    expect(response.status).to.equal(400);
    expect(response.body.error).to.equal('Missing required fields');
    expect(response.body.required).to.deep.equal(['userId', 'code']);
  });

  it('returns 404 when verifying a nonexistent account', async () => {
    const response = await request(app)
      .post('/api/auth/verify')
      .send({ userId: '999999', code: '123456' });

    expect(response.status).to.equal(404);
    expect(response.body.error).to.equal('Account not found');
  });

  it('gets an account by userId', async () => {
    const signup = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'me@internbuddy.app', phone: '+15550006666' });

    const response = await request(app)
      .get(`/api/auth/${signup.body.account.userId}`);

    expect(response.status).to.equal(200);
    expect(response.body.account.userId).to.equal(signup.body.account.userId);
    expect(response.body.account.email).to.equal('me@internbuddy.app');
  });

  it('returns 404 for a nonexistent account lookup', async () => {
    const response = await request(app)
      .get('/api/auth/999999');

    expect(response.status).to.equal(404);
    expect(response.body.error).to.equal('Account not found');
  });
});
