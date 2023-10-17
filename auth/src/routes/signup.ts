import express, { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { body } from "express-validator";

import { validateRequest, BadRequestError } from "@learningmc/common";

const router = express.Router();



// The epxress validator will validate the key containing in the req body and check if it is valid or not
// if not valid it will append the errors in an array and we can get it by passing in the request in the parameter
// validationResult() function !

router.post(
    '/api/users/signup',
    [
        body('email')
            .isEmail()
            .withMessage("Email must be valid"),
        body('password')
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage("Password must be between 2 and 20 characters"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new BadRequestError('');
        }

        const user = User.build({ email, password });

        await user.save();

        // Generate JWT
        const userJwt = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY!);

        // Store the jwt in session(cookie)
        req.session = {
            jwt: userJwt
        }
        // The response will be having the cookie and the data in it !!! 

        res.status(201).json(user);

    }
);

export { router as signupRouter };
