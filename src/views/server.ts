import { CLIENT_RENEG_LIMIT } from 'tls';
import app from '../config/app.config'
import colors from 'colors'
import connectDB from '../config/db.config';
import seedData from '../config/seeds/seeder.seeds';
import dotenv from 'dotenv';
import path from 'path';

// Log the current directory and .env path
// console.log('Current directory:', __dirname);
// console.log('Env file path:', path.join(__dirname, '../../.env'));

// Load env variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Debug log all env variables (be careful with sensitive data)
// console.log('Environment variables loaded:', {
//   nodeEnv: process.env.NODE_ENV,
//   paystackKey: process.env.PAYSTACK_SECRET_KEY ? 'EXISTS' : 'MISSING',
//   mongodb: process.env.MONGODB_URI ? 'EXISTS' : 'MISSING'
// });




const connect = async (): Promise<void> => {
 
    // connect database
    await connectDB();
  
  
    // seed data
    await seedData();
 

}
  
connect();

const PORT = process.env.PORT;

const server= app.listen(PORT, () =>{
    console.log(colors.yellow.bold(`Server Running In ${process.env.NODE_ENV} mode`))
})

  
//catch unhandled promise rejections
process.on('unhandledRejection', (err: any, promise) => {
console.log(colors.red(`err:: ${err.message}`));
server.close(() => process.exit(1));

})