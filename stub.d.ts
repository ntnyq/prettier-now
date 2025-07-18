// TODO: sveltejs/prettier-plugin-svelte/469
declare module 'prettier-plugin-svelte/browser' {
  import type {
    Parser,
    Printer,
    SupportLanguage,
    SupportOption,
  } from 'prettier'
  export declare const options: Record<string, SupportOption>
  export declare const languages: SupportLanguage[]
  export declare const parsers: {
    svelte: Parser
    svelteExpressionParser: Parser
    svelteTSExpressionParser: Parser
  }
  export declare const printers: {
    'svelte-ast': Printer
  }
}
