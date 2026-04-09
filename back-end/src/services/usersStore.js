// mock user profiles - just enough data to display in the connections UI
const users = new Map([
  ['1', { id: '1', name: 'Alissa', role: 'SWE Intern @ Airbnb', image: 'https://picsum.photos/seed/user1/100/100' }],
  ['2', { id: '2', name: 'John Green', role: 'SWE Intern @ Google', image: 'https://picsum.photos/seed/user2/100/100' }],
  ['3', { id: '3', name: 'Priya S.', role: 'Design Intern @ Figma', image: 'https://picsum.photos/seed/user3/100/100' }],
  ['4', { id: '4', name: 'Jordan K.', role: 'PM Intern @ Stripe', image: 'https://picsum.photos/seed/user4/100/100' }],
]);

function getUserById(id) {
  return users.get(id) || { id, name: 'Unknown User', role: '', image: 'https://picsum.photos/seed/unknown/100/100' };
}

module.exports = { getUserById };
