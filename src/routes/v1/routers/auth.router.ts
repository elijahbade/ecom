import express from 'express'
import { validateChannels as vcd } from '../../../middleware/header.mw'
import { register } from '../../../controllers/auth.controllers';
import { login } from '../../../controllers/login.controllers';

const router = express.Router({ mergeParams: true });

router.post('/register', vcd, register)
router.post('/login', vcd, login)

export default router;