import { Publisher, OrderCancelledEvent, Subjects } from "@learningmc/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
