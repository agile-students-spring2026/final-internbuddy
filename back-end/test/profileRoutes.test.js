const request = require('supertest');
const { expect } = require('chai');

const app = require('../src/app');

describe('Profile routes', () => {
  it('gets a profile by userId', async () => {
    const signup = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'profile1@internbuddy.app', phone: '+15551110001' });

    const userId = signup.body.account.userId;

    const response = await request(app)
      .get(`/api/profile/${userId}`);

    expect(response.status).to.equal(200);
    expect(response.body.profile).to.have.property('userId', userId);
    expect(response.body.profile).to.have.property('steps');
    expect(response.body.profile.completed).to.equal(false);
  });

  it('returns 404 when profile does not exist', async () => {
    const response = await request(app)
      .get('/api/profile/999999');

    expect(response.status).to.equal(404);
    expect(response.body.error).to.equal('Profile not found');
  });

  it('rejects saveStep when step is missing', async () => {
    const signup = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'profile2@internbuddy.app', phone: '+15551110002' });

    const userId = signup.body.account.userId;

    const response = await request(app)
      .post(`/api/profile/${userId}/step`)
      .send({ value: 'NYU' });

    expect(response.status).to.equal(400);
    expect(response.body.error).to.equal('Missing required fields');
    expect(response.body.required).to.deep.equal(['step', 'value']);
  });

  it('returns 404 when saving a step for a nonexistent account', async () => {
    const response = await request(app)
      .post('/api/profile/999999/step')
      .send({ step: 'school', value: 'NYU' });

    expect(response.status).to.equal(404);
    expect(response.body.error).to.equal('Account not found');
  });

  it('saves a profile step', async () => {
    const signup = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'profile3@internbuddy.app', phone: '+15551110003' });

    const userId = signup.body.account.userId;

    const response = await request(app)
      .post(`/api/profile/${userId}/step`)
      .send({ step: 'school', value: 'NYU' });

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal('Profile step saved (mock)');
    expect(response.body.savedStep).to.equal('school');
    expect(response.body.profile.userId).to.equal(userId);
    expect(response.body.profile.steps.school).to.equal('NYU');
  });

  it('returns the next step when saving a profile step', async () => {
    const signup = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'profile4@internbuddy.app', phone: '+15551110004' });

    const userId = signup.body.account.userId;

    const response = await request(app)
      .post(`/api/profile/${userId}/step`)
      .send({ step: 'school', value: 'Columbia' });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('nextStep');
  });

  it('completes a profile', async () => {
    const signup = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'profile5@internbuddy.app', phone: '+15551110005' });

    const userId = signup.body.account.userId;

    const response = await request(app)
      .post(`/api/profile/${userId}/complete`)
      .send();

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal('Profile completed (mock)');
    expect(response.body.profile.completed).to.equal(true);
    expect(response.body.profile).to.have.property('completedAt');
  });

  it('returns 404 when completing a nonexistent profile', async () => {
    const response = await request(app)
      .post('/api/profile/999999/complete')
      .send();

    expect(response.status).to.equal(404);
    expect(response.body.error).to.equal('Profile not found');
  });
});
