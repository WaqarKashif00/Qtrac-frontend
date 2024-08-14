import { DOCUMENT } from '@angular/common';
import { inject, InjectionToken } from '@angular/core';

export const LOCATION = new InjectionToken<Location>(
    'window.location object',
    {
        factory: () => inject(DOCUMENT).location,
    },
);
