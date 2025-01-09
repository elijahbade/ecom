import colors from "colors";
import { logRequestDTO } from "../dtos/system.dtos";
class Logger {
  constructor() {}
  /**
   * @name log
   * @description logs out the data supplied to console
   * @param { logRequestDTO }payload - see logRequestDTO
   * @returns {void} - void
   */
  public log(payload: logRequestDTO) {
    const { data, label, type } = payload; //we destructure to access individual data.
    if (data) {
      if (label) {
        console.log(label);
      }
      if (typeof data === "string") {
        if (type) {
          if (type === "error") {
            console.log(colors.red.bold(data));
          } else if (type === "success") {
            console.log(colors.green(data));
          } else if (type === "warning") {
            console.log(colors.yellow(data));
          } else if (type === "info") {
            console.log(colors.blue(data));
          }
        } else {
          console.log(data);
        }
      } else {
        console.log(data);
      }
    }
  }
}
export default new Logger();