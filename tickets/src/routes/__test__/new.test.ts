import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("has a route handler listening to /api/tickets/ for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is not signed in", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const res = signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", res)
    .send({});
  expect(response.status).not.toEqual(401);
});

it("returns an error if an invailid title is provided", async () => {
  const res = signin();
  await request(app)
    .post("/api/tickets")
    .set("Cookie", res)
    .send({ title: "", price: 10 })
    .expect(400);
});

it("return an error if an invalid price is provided", async () => {
  const res = signin();
  await request(app)
    .post("/api/tickets")
    .set("Cookie", res)
    .send({ title: "asdf", price: -10 })
    .expect(400);
});

it("creates a ticket with valid inputs", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);
  const res = signin();
  await request(app)
    .post("/api/tickets")
    .set("Cookie", res)
    .send({ title: "asdfasdf", price: 20 })
    .expect(201);
  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
});

it("publishes an event", async () => {
  const res = signin();
  await request(app)
    .post("/api/tickets")
    .set("Cookie", res)
    .send({ title: "asdfasdf", price: 20 })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
