# Project Title
InternBuddy - Helping interns find community faster

# Team Members
- [Sean Tang](https://github.com/plant445)
- [Grace He](https://github.com/gracehe04)
- [Angelina Wu](https://github.com/tangelinawu)
- [Alissa Wu](https://github.com/alissawu)
- [Charlie Li](https://github.com/CharlieLi111)

# Run Locally

## Prerequisites
- Node.js 18+ and npm
- A MongoDB Atlas connection string

## 1. Start the backend
1. Open a terminal and go to `back-end/`.
2. Install dependencies:
  ```bash
  npm install
  ```
3. Create `back-end/.env` with:
  ```env
  MONGO_URI=your-mongodb-atlas-uri
  JWT_SECRET=your-long-random-secret
  PORT=3001
  ```
4. Start the backend server:
  ```bash
  npm run dev
  ```
5. Confirm the API is running at `http://localhost:3001/api/health`.

## 2. Start the frontend
1. Open a second terminal and go to `front-end/`.
2. Install dependencies:
  ```bash
  npm install
  ```
3. Start the frontend dev server:
  ```bash
  npm run dev
  ```
4. Open the URL printed by Vite (usually `http://localhost:5173`).

## Useful commands
- Backend tests:
  ```bash
  cd back-end
  npm test
  ```
- Frontend production build:
  ```bash
  cd front-end
  npm run build
  ```

# What and Why?

InternBuddy is a mobile web application designed to help students connect with other students who are interning at the same company, in the same city, or during the same time period. Every summer, thousands of interns relocate to new cities where they know very few people. While internships are professionally exciting, they can also be socially isolating and logistically overwhelming.

Currently, interns rely on scattered solutions like LinkedIn posts, group chats, spreadsheets, or word-of-mouth to find peers. InternBuddy solves this by providing a centralized, trusted, and student-focused platform for interns to find community, coordinate meetups, and share local knowledge.

For students who are more reserved or hesitant to initiate in-person interactions, InternBuddy lowers the barrier to social connection by enabling asynchronous, context-based discovery. Rather than approaching strangers in unfamiliar environments, users can first connect through shared attributes and interests, making in-person meetups feel more comfortable and intentional.

By reducing friction in social discovery, InternBuddy helps interns feel more supported, confident, and connected during their internships.

# For Who?

InternBuddy is built for college students who are actively interning. Initial end-users include:

* University students interning at mid-to-large companies (e.g., tech, finance, media, consulting)
* Students relocating for their internships

These users are easy to identify, reach and interview throughout the semester, allowing for continuous feedback and iteration

# How?

InternBuddy will allow students to:
* Create a profile with their school, company, role, city and internship dates
* Discover other interns based on shared attributes (same company, city, hobbies or overlapping dates)
* Join city-based or company-based groups
* View and post casual meetups (coffee chats, group lunches, weekend plans)
* Share tips like housing advice, commute tips or intern events

The app is designed to be mobile-first, lightweight, and friendly, emphasizing low-pressure social connection instead of formal networking

# Scope

InternBuddy is appropriately scoped for a team of 4–6 programmers to complete within one semester. The core functionality(user profiles, intern discovery, and meetup postings) can be developed incrementally, with each feature clearly separable into frontend and backend components.

### Minimum Viable Product (MVP)

The initial MVP will focus on the following core features:

- **Account creation and profile setup**
- **Login, logout, and password reset**
- **Intern discovery** filtered by company, city, and internship dates
- **City-based and company-based groups**
- **Basic meetup event creation and viewing** on an events page

These features establish the core user experience while keeping technical complexity manageable.

### Stretch Goals

Once a stable initial product is deployed, the following stretch goals can be pursued:

- **Direct messaging between users**  
  Enable one-on-one communication between interns to coordinate meetups or ask questions.

- **Event discussion threads**  
  Allow users to comment within meetup events to ask questions or coordinate logistics.

- **Location-aware meetup suggestions**  
  Users can opt in to sharing approximate location data to receive recommendations for nearby meetups.

- **Map-based intern discovery**  
  Users may opt in to viewing nearby interns on a map using coarse, privacy-preserving location data without revealing exact addresses or sensitive information.

Stretch goals will only be implemented after core functionality is complete and will be used to demonstrate user-centered design considerations.