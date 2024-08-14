import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Message, SendMessageEvent, User } from '@progress/kendo-angular-conversational-ui';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { NoteStatus } from '../models/notes/note-status.enum';
import { INote } from '../models/notes/note.inteface';
import { AgentNotesModalService } from './agent-notes-modal.service';

@Component({
  selector: 'lavi-agent-notes-modal',
  templateUrl: './agent-notes-modal.component.html',
  styleUrls: ['./agent-notes-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentNotesModalComponent extends AbstractComponent {

  IsChatDialogShow$: Observable<boolean>;

  ChatMessages$: Observable<Message[]>;

  Messages$: Observable<INote[]>;
  CustomerName$: Observable<string>;
  CustomerName: string;

  User: User;

  constructor(private service: AgentNotesModalService) {
    super();
    this.IsChatDialogShow$ = service.IsChatDialogShow$;
    this.Messages$ = service.Messages$;
    this.CustomerName$ = service.CustomerName$;
    this.subs.sink = service.CustomerName$.subscribe(name => this.CustomerName = name);
    this.User = this.service.User;

    this.ChatMessages$ = service.Messages$.pipe(map(messages => {
      return messages.map(x => {
        const msg: Message = {
          author: {
            id: x.senderId,
            name: x.senderName,
            avatarUrl: x.senderImageUrl ? x.senderImageUrl : this.GetNameInitialsImage(x.senderName)
          },
          text: x.noteText,
          timestamp: new Date(x.noteTimeUTCString),
          status: x.noteStatus
        };
        return msg;
      });
    }));
  }

  GetNameInitialsImage(name: string) {

    // alert(name)
    let initials = name?.split(' ').map(x => x[0].toString().toUpperCase()).join('');
    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // Set width and height
    canvas.width = 200;
    canvas.height = 200;
    // Draw the image
    ctx.fillStyle = "#ff5e00";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "90px Iter";
    ctx.fillStyle = "white";
    ctx.fillText(initials, 40, 135);
    return canvas.toDataURL('image/jpeg');
  }

  RenderMarkdown(msg: Message) {
    if (msg.status == NoteStatus.Unread) {
      return `<div class="unread-label">Unread Messages ↓</div>`;
    } else {
      return msg.text;
    }
  }

  Destroy() {
    this.service.Destroy();
  }

  Close(): void {
    this.service.HideChatModal();
    this.Destroy();
  }

  public SendMessage(e: SendMessageEvent): void {
    this.service.SendNote(e.message.text);
  }

}