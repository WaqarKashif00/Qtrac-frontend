import {DOCUMENT} from '@angular/common';
import {Inject, Injectable, Sanitizer, SecurityContext} from '@angular/core';
import * as dompurify from 'dompurify';
import {DOMPurifyI} from 'dompurify';
import {Config, HookEvent} from 'dompurify';
import {HookName} from 'dompurify';
import {InjectionToken} from '@angular/core';


export type DompurifyHook = (
    currentNode: Element,
    data: HookEvent,
    config: Config,
) => void;


export type DompurifyConfig = Config & {
    RETURN_DOM_FRAGMENT?: false;
    RETURN_DOM?: false;
};

export type SanitizeStyle = (style: string) => string;

export type CustomDompurifyHook = {
    readonly name: HookName;
    readonly hook: DompurifyHook;
};

export const DOMPURIFY_CONFIG = new InjectionToken<DompurifyConfig>(
    'Config for DOMPurify',
    {
        factory: () => ({}),
        providedIn: 'root',
    },
);

export const DOMPURIFY_HOOKS = new InjectionToken<ReadonlyArray<CustomDompurifyHook>>(
    'Hooks for DOMPurify',
    {
        factory: () => [],
        providedIn: 'root',
    },
);


export const SANITIZE_STYLE = new InjectionToken<SanitizeStyle>(
    'A function that sanitizes value for a CSS rule',
    {
        factory: () => value => value,
        providedIn: 'root',
    },
);
const createDOMPurify = dompurify;

@Injectable({
    providedIn: 'root',
})
export class DompurifySanitizer implements Sanitizer {
    private readonly domPurify: DOMPurifyI;

    constructor(
        @Inject(DOMPURIFY_CONFIG)
        private readonly config: DompurifyConfig,
        @Inject(SANITIZE_STYLE)
        private readonly sanitizeStyle: SanitizeStyle,
        @Inject(DOCUMENT) {defaultView}: Document,
        @Inject(DOMPURIFY_HOOKS)
        hooks: ReadonlyArray<CustomDompurifyHook>,
    ) {
        this.domPurify = createDOMPurify(defaultView!);

        hooks.forEach(({name, hook}) => {
            this.domPurify.addHook(name, hook);
        });
    }

    sanitize(
        context: SecurityContext,
        value: {} | string | null,
        config: DompurifyConfig = this.config,
    ): string {
        if (context === SecurityContext.SCRIPT) {
            throw new Error('DOMPurify does not support SCRIPT context');
        }

        return context === SecurityContext.STYLE
            ? this.sanitizeStyle(String(value))
            : this.domPurify.sanitize(String(value || ''), config);
    }
}