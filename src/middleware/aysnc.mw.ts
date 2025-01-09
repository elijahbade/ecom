

import { Request, Response, NextFunction } from 'express';

/** Normal promise will require that we use the async-await that
leadsimport { NextFunction } from "express"
 to using the try-cat BlockList. 
The async handlelrs helps to avoid repeating the BlockList. 
// Our fucntions are controllers functions but require us to use the try catch BlockList
*/

const asyncHandler = (fn:any) => (
    req: Request, res: Response, next: NextFunction) => 
        Promise.resolve(fn(req, res, next).catchnext)

export default asyncHandler;
