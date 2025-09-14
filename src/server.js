const app = require('./app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 4000;
const MONGO = process.env.MONGO_URI;

mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Mongo connected');
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch(err => {
    console.error('DB connect failed', err);
    process.exit(1);
  });
