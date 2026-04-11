// mock user profiles - just enough data to display in the connections UI
const users = new Map([
  ['1', { id: '1', name: 'Lisa', role: 'SWE Intern @ Airbnb', image: 'https://picsum.photos/seed/user1/100/100' }],
  ['2', { id: '2', name: 'John Green', role: 'SWE Intern @ Google', image: 'https://picsum.photos/seed/user2/100/100' }],
  ['3', { id: '3', name: 'Priya S.', role: 'Design Intern @ Figma', image: 'https://picsum.photos/seed/user3/100/100' }],
  ['4', { id: '4', name: 'Jordan K.', role: 'PM Intern @ Stripe', image: 'https://picsum.photos/seed/user4/100/100' }],
  ['101', { id: '101', name: 'Sarah', role: 'Data Science Intern @ Google', image: 'https://picsum.photos/seed/profile1/100/100' }],
  ['102', { id: '102', name: 'Jessica', role: 'SWE Intern @ Meta', image: 'https://picsum.photos/seed/profile2/100/100' }],
  ['103', { id: '103', name: 'Alex', role: 'PM Intern @ Apple', image: 'https://picsum.photos/seed/profile3/100/100' }],
  ['104', { id: '104', name: 'Elena', role: 'UX Design Intern @ Adobe', image: 'https://picsum.photos/seed/profile4/100/100' }],
  ['105', { id: '105', name: 'Morgan', role: 'Backend Intern @ Stripe', image: 'https://picsum.photos/seed/profile5/100/100' }],
]);

function getUserById(id) {
  return users.get(id) || { id, name: 'Unknown User', role: '', image: 'https://picsum.photos/seed/unknown/100/100' };
}

module.exports = { getUserById };
