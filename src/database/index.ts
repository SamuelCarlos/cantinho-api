import mongoose from 'mongoose';

const mongoID = process.env.MONGO_ID;
const mongoPass = process.env.MONGO_PASS;
const mongoDB = process.env.MONGO_DB;

const uri = `mongodb+srv://${mongoID}:${mongoPass}@cantinho-nayara.kv7x6.mongodb.net/${mongoDB}?retryWrites=true&w=majority`;

mongoose.connect(uri);

const connection = mongoose.connection;

connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', () => console.log('MongoDB connected...'));

export default connection;
