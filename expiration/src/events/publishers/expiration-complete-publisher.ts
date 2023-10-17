import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@learningmc/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
