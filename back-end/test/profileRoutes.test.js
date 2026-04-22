const request = require('supertest');
const { expect } = require('chai');

const app = require('../src/app');
const User = require('../src/models/User');
const Profile = require('../src/models/Profile');

describe('Profile routes', () => {
  async function registerAndGetToken() {
    const email = `profile-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@profiletest.internbuddy`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email, phone: '+15551110001', password: 'Password123!' });

    return {
      token: res.body.token,
      userId: res.body.user.id,
      email,
    };
  }

  afterEach(async () => {
    await Profile.deleteMany({});
    await User.deleteMany({ email: /@profiletest\.internbuddy$/i });
  });

  it('GET /api/profile/me requires auth', async () => {
    const response = await request(app).get('/api/profile/me');

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('Authorization token is required');
  });

  it('returns 404 when profile does not exist yet', async () => {
    const { token } = await registerAndGetToken();

    const response = await request(app)
      .get('/api/profile/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).to.equal(404);
    expect(response.body.error).to.equal('Profile not found');
  });

  it('POST /api/profile requires auth', async () => {
    const response = await request(app)
      .post('/api/profile')
      .send({ name: 'No Auth User' });

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('Authorization token is required');
  });

  it('saves profile and marks onboarding complete', async () => {
    const { token, userId } = await registerAndGetToken();

    const response = await request(app)
      .post('/api/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Profile Test User',
        school: 'NYU',
        city: 'New York',
        interests: ['Music', 'Food'],
      });

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal('Profile saved');
    expect(response.body.profile).to.have.property('userId', userId);
    expect(response.body.profile).to.have.property('completed', true);
    expect(response.body.profile).to.have.property('completedAt');
  });

  it('GET /api/profile/me returns saved profile', async () => {
    const { token, userId } = await registerAndGetToken();

    await request(app)
      .post('/api/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Saved Profile User',
        major: 'Computer Science',
      });

    const response = await request(app)
      .get('/api/profile/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).to.equal(200);
    expect(response.body.profile).to.have.property('userId', userId);
    expect(response.body.profile).to.have.property('name', 'Saved Profile User');
    expect(response.body.profile).to.have.property('major', 'Computer Science');
  });
});
