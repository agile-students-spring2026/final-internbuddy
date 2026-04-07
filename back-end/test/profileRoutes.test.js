const request = require('supertest');
const { expect } = require('chai');

const app = require('../src/app');

describe('Profile routes', () => {
  it('saves a profile step after signup', async () => {
    const signup = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'profile@internbuddy.app', phone: '+15559871234' });

    const userId = signup.body.account.userId;

    const response = await request(app)
      .post(`/api/profile/${userId}/step`)
      .send({ step: 'name', value: { firstName: 'Sam', lastName: 'Lee' } });

    expect(response.status).to.equal(200);
    expect(response.body.savedStep).to.equal('name');
    expect(response.body.profile.steps.name.firstName).to.equal('Sam');
  });

  it('marks profile as complete', async () => {
    const signup = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'complete@internbuddy.app', phone: '+15557654321' });

    const userId = signup.body.account.userId;

    const response = await request(app)
      .post(`/api/profile/${userId}/complete`)
      .send();

    expect(response.status).to.equal(200);
    expect(response.body.profile.completed).to.equal(true);
  });
});
