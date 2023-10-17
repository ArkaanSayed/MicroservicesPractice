import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { currentuserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { NotFoundError, errorHandler } from "@learningmc/common";

const app = express();
app.set("trust proxy", true);
app.use(express.json());

// Instead of using a data store to store the cookie and information we use a library !
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentuserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);

// Whenever any route throws an error the error Handler will handle that error !
// This is how you use an error handler using express !! Got it
app.use(errorHandler);

// In an async function if we throw an error and not return any promise or anything in general
// Then the async function will never terminate, so use next(throw new Error()) || use import 'express-async-errors';
app.all("*", async (req, res) => {
  throw new NotFoundError();
});

export { app };
