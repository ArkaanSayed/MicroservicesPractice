import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { body } from "express-validator";
import { validateRequest, BadRequestError } from '@learningmc/common';
import { User } from '../models/user';
import { Password } from '../services/password';

const router = express.Router();

router.post('/api/users/signin',
    [
        body('email').isEmail().withMessage('Email must be valid'),
        body('password').trim().notEmpty().withMessage('You must supply a password')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            throw new BadRequestError('User does not exist please Sign in');
        }

        const passwordsMatch = await Password.compare(existingUser.password, password);
        if (!passwordsMatch) {
            throw new BadRequestError('Invalid credentials');
        }

        const userJwt = jwt.sign({ id: existingUser.id, email: existingUser.email }, process.env.JWT_KEY!);

        // Store the jwt in session(cookie)
        req.session = {
            jwt: userJwt
        }
        // The response will be having the cookie and the data in it !!! 

        res.status(200).json(existingUser);

    });

export { router as signinRouter };