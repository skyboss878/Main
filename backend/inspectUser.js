const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  const user = await User.findOne({ email: "testuser@example.com" });
  console.log(user);
  mongoose.disconnect();
}).catch(err => {
  console.error("MongoDB error:", err);
});
