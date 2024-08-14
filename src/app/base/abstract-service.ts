import { Injectable, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';

@Injectable()
export abstract class AbstractService implements OnDestroy {

  public subs = new SubSink();

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
