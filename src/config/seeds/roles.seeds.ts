import fs from "fs";
import colors from "colors";
import logger from "../../utils/logger.utils";
import Role from "../../models/Role.models";
import { IRoleDoc } from "../../utils/interface.utils";


// read in the JSON data by using __dirname to get url
const rolesData = JSON.parse(
  fs.readFileSync(`${__dirname.split("config")[0]}_data/roles.json`, "utf-8")
);


export const seedRoles = async () => {
  // logger.log({ label: 'DIR', data: roles })
  try {
      
      const roles: Array<IRoleDoc> = await Role.find({});

      if (roles.length === 0) {
          const seed = await Role.insertMany(rolesData);

          if (seed) {
              logger.log({
                  data: 'roles seeded successfully',
                  type: 'info'
              })
          }
      }

  

  } catch (err) {
      
      logger.log({ label: 'ERR', data: err })

  }
}