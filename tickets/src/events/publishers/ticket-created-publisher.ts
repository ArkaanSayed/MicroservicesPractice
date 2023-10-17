import { Publisher, Subjects, TicketCreatedEvent } from "@learningmc/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
