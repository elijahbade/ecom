import { seedRoles } from './roles.seeds'
import { seedUsers } from './user.seeds'

const seedData = async () => {

        //seed all roles
    await seedRoles()

    //see all users
    await seedUsers();

}

export default seedData;