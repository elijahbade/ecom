import { CLIENT_RENEG_LIMIT } from 'tls';
import app from '../config/app.config'
import colors from 'colors'
import { log } from 'console';
import connectDB from '../config/db.config';

// const connect = async (): Promise<void> => {
 
//     // connecty
//  database
//     await connectDB();
  
  
//     // seed data
//     await seedData();
//   }
  
// connect();

const PORT = process.env.PORT;

const server= app.listen(PORT, () =>{
    console.log(colors.yellow.bold(`Server Running In ${process.env.NODE_ENV} mode`))
})

//catch unhandled promise rejections
process.on('unhandledRejection', (err: any, promise) => {
console.log(colors.red(`err:: ${err.message}`));
server.close(() => process.exit(1));

})