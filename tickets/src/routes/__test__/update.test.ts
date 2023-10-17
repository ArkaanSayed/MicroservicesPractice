import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("it returns 404 if provided ticket id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", signin())
    .send({ title: "Concert", price: 35.3 })
    .expect(404);
});

it("it returns 401 if user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    //   .set("Cookie", signin())
    .send({ title: "Concert", price: 35.3 })
    .expect(401);
});

it("it returns 401 if user does not own the ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      title: "concert",
      price: 201.5,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", signin())
    .send({ title: "Concert", price: 35.3 })
    .expect(401);
});

it("it returns 400 if the user provides an invalid title or price", async () => {
  const res = signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", res)
    .send({
      title: "concert",
      price: 201.5,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", res)
    .send({ title: "", price: 20.4 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", res)
    .send({ title: "Concert", price: -10 })
    .expect(400);
});

it("it updates the ticket provided valid inputs", async () => {
  const res = signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", res)
    .send({
      title: "concert",
      price: 201.5,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", res)
    .send({ title: "Wasssup", price: 20.4 })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual("Wasssup");
  expect(ticketResponse.body.price).toEqual(20.4);
});

it("publishes an event", async () => {
  const res = signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", res)
    .send({
      title: "concert",
      price: 201.5,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", res)
    .send({ title: "Wasssup", price: 20.4 })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("rejects updates if the ticket is reserved", async () => {
  const res = signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", res)
    .send({
      title: "concert",
      price: 201.5,
    })
    .expect(201);

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", res)
    .send({ title: "Wasssup", price: 20.4 })
    .expect(400);
});
