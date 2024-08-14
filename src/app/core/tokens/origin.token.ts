import { DOCUMENT } from '@angular/common';
import { inject, InjectionToken } from '@angular/core';

export const ORIGIN = new InjectionToken<string>(
    'window.location.origin',
    {
        factory: () => inject(DOCUMENT).location.origin,
    },
);
