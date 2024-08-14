import { TabType } from './agent-tab-type.enum';

export interface ITab {
    id: string;
    name: string;
    type: TabType;
}

export class QueueTab implements ITab {
    id: string;
    name: string;
    type: TabType;
    constructor(tabName) {
        this.id = 'Queue';
        this.name = tabName;
        this.type = TabType.QUEUE;
    }
}


export class CalendarTab implements ITab {
    id: string;
    name: string;
    type: TabType;
    constructor(tabName) {
        this.id = 'Calendar';
        this.name = tabName;
        this.type = TabType.CALENDAR;
    }
}


export class TicketsTab implements ITab {
    id: string;
    name: string;
    type: TabType;
    constructor(tabName) {
        this.id = 'Tickets';
        this.name = tabName;
        this.type = TabType.TICKETS;
    }
}
