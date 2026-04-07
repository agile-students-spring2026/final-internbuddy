const app = require('./app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`InternBuddy backend listening on port ${PORT}`);
});
