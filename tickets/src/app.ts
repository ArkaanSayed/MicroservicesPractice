import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes/index";
import { updateTicketRouter } from "./routes/update";
import { currentUser, NotFoundError, errorHandler } from "@learningmc/common";

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

app.use(currentUser);
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

// In an async funciton if we throw an error and not return any promise or anything in general
// Then the async function will never terminate, so use next(throw new Error()) || use import 'express-async-errors';
app.all("*", async (req, res) => {
  throw new NotFoundError();
});

// Whenever any route throws an error the error Handler will handle that error !
// This is how you use an error handler using express !! Got it
app.use(errorHandler);

export { app };
