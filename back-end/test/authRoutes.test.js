const request = require('supertest');
const { expect } = require('chai');

const app = require('../src/app');
const User = require('../src/models/User');

describe('Auth routes', () => {
  afterEach(async () => {
    await User.deleteMany({ email: /@authtest\.internbuddy$/i });
  });

  function uniqueEmail(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@authtest.internbuddy`;
  }

  it('validates register payload', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ email: 'not-an-email', password: 'short' });

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
    const response = await request(app).get('/api/auth/me');

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('Authorization token is required');
  });

  it('creates an account via register', async () => {
    const email = uniqueEmail('register');

    const response = await request(app)
      .post('/api/auth/register')
      .send({ email, password: 'Password123!' });

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('token');
    expect(response.body.user.email).to.equal(email);
    expect(response.body.user).to.have.property('id');
  });

  it('rejects duplicate emails regardless of case', async () => {
    const email = uniqueEmail('dupcase');

    await request(app)
      .post('/api/auth/register')
      .send({ email, password: 'Password123!' });

    const response = await request(app)
      .post('/api/auth/register')
      .send({ email: email.toUpperCase(), password: 'Password123!' });

    expect(response.status).to.equal(409);
    expect(response.body.error).to.equal('Account with this email already exists');
  });

  it('logs in an existing account', async () => {
    const email = uniqueEmail('loginok');
    const password = 'Password123!';

    await request(app)
      .post('/api/auth/register')
      .send({ email, password });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email, password });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('token');
    expect(response.body.user.email).to.equal(email);
  });

  it('rejects invalid login password', async () => {
    const email = uniqueEmail('loginfail');

    await request(app)
      .post('/api/auth/register')
      .send({ email, password: 'Password123!' });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email, password: 'wrong-password' });

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('Invalid email or password');
  });

  it('returns current user for a valid token', async () => {
    const email = uniqueEmail('me');

    const register = await request(app)
      .post('/api/auth/register')
      .send({ email, password: 'Password123!' });

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${register.body.token}`);

    expect(response.status).to.equal(200);
    expect(response.body.user.email).to.equal(email);
    expect(response.body.user).to.have.property('id');
  });
});
