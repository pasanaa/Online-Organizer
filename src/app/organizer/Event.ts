import { Time } from '@angular/common';

export class Event {
    EventId: number;
    EventDate: Date;
    EventName: string;
    EventStartTime : Time;
    EventEndTime: Time;
    EventSearch: string;
}