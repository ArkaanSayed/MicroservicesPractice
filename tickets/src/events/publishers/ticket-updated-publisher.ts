import { Publisher, Subjects, TicketUpdateEvent } from "@learningmc/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdateEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
