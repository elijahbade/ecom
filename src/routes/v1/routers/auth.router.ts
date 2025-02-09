import express from 'express'
import { validateChannels as vcd } from '../../../middleware/header.mw'
import { register } from '../../../controllers/auth.controllers';
import { checkUser, login } from '../../../controllers/login.controllers';


const router = express.Router();

router.post('/register',  register)
router.post('/login',  login)

router.get('/check-user', checkUser)
  


export default router;