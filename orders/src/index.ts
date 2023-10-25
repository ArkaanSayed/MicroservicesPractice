import mongoose from "mongoose";
import { natsWrapper } from "../src/nats-wrapper";
import { app } from "./app";
import { TicketCreatedListener } from "./events/listener/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listener/ticket-update-listener";
import { ExpirationCompleteListener } from "./events/listener/expiration-complete-listener";
import { PaymentsCreatedListener } from "./events/listener/payment-created-listener";

app.listen(3000, async () => {
  console.log("Starting in orders service...");
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }

  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on("close", () => {
      console.log("Nats connection close");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());
    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    new PaymentsCreatedListener(natsWrapper.client).listen();
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to mongoDb");
    console.log("listening on port 3000!!!!");
  } catch (error) {
    console.error(error);
  }
});
