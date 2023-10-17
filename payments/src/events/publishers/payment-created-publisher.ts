import { Subjects, Publisher, PaymentsCreatedEvent } from "@learningmc/common";

export class PaymentsCreatedPublisher extends Publisher<PaymentsCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
