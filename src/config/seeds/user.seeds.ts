import fs from 'fs';


import logger from "../../utils/logger.utils";
import User from '../../models/User.model';



// read in the JSON file
const usersData = JSON.parse(
  fs.readFileSync(`${__dirname.split("config")[0]}_data/users.json`, "utf-8")
  
);



export const seedUsers = async () => {


    try {


        let count: number = 0;
        const users = await User.countDocuments();  // because there is potential for thousands of records
       
        if(users === 0){


            for(let i = 0; i < usersData.length; i++){


                let item = usersData[i];


                let user = await User.create(item);


                if(user){


                    count += 1;
                }
            }


            if(count > 0){
                logger.log({
                    data: 'users seeded successfully',
                    type: 'success'
                })
            }
        }
    } catch(err) {


        logger.log({label: 'ERR:', data: err})
    }
}
