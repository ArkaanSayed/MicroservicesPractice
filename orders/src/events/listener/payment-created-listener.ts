import { Message } from "node-nats-streaming";
import { Subjects, Listener, PaymentsCreatedEvent } from "@learningmc/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/orders";
import { OrderStatus } from "@learningmc/common";

export class PaymentsCreatedListener extends Listener<PaymentsCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentsCreatedEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId);
    if (!order) {
      throw new Error("Order Not Found");
    }
    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();
    msg.ack();
  }
}
