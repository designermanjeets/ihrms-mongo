// require('dotenv').config()

const env = {
  "PORT": "8080",
  // "MONGODB_URI_IHRMS": "mongodb+srv://gonn-user:Sharma%4011@gonn.kqkyayc.mongodb.net/msv4?retryWrites=true&w=majority", // NEW Dev URL
  "MONGODB_URI_IHRMS": "mongodb+srv://gonn-user:Sharma%4011@ihrms-free.ysswmv8.mongodb.net/msv4?retryWrites=true&w=majority", // NEW Dev Free URL
  "JWT_SECRET": "mscreativepixelms",
  "secret": "mscreativepixelms",
  "JWT_LIFE_TIME": "1d",
  "WORKERS": "1"
}

const PORT = env.PORT
const MONGODB_URI = env.MONGODB_URI_IHRMS
const WORKERS = env.WORKERS
const JWT_LIFE_TIME = env.JWT_LIFE_TIME
const JWT_SECRET = env.JWT_SECRET
const secret = env.JWT_SECRET

module.exports = {
  PORT,
  MONGODB_URI,
  WORKERS,
  JWT_LIFE_TIME,
  JWT_SECRET,
  secret
}
