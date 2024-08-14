import { NoteStatus } from "./note-status.enum";

export interface INote {
    type: string,
    id: string,
    pk: string,//{kioskRequestId},

    senderId: string; // {AgentId}
    senderName: string;
    senderImageUrl: string;

    noteText: string;
    noteStatus: NoteStatus;
    noteTimeUTCString: string;
}
