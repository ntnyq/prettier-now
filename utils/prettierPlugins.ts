import { interopDefault } from '@ntnyq/utils'
import { LANGUAGE_ID } from '@/constants/language'
import type { LanguageId } from '@/types/language'
import type { PrettierPlugin } from '@/types/vendor'

/**
 * Prettier plugin cache keyed by shared plugin id.
 */
const prettierPluginCache = new Map<string, PrettierPlugin>()

/**
 * Prettier plugin import shape for packages that nest the plugin export.
 */
type PrettierPluginImport = PrettierPlugin & {
  /**
   * Nested plugin export used by some plugin packages.
   */
  plugin?: PrettierPlugin
}

/**
 * Resolve the plugin instance from a direct or nested plugin import.
 *
 * @param plugin - Plugin import value.
 * @returns Resolved Prettier plugin.
 */
function resolvePrettierPlugin(plugin: PrettierPluginImport): PrettierPlugin {
  return 'plugin' in plugin && plugin.plugin ? plugin.plugin : plugin
}

/**
 * Shared cache keys for Prettier plugins.
 */
const PRETTIER_PLUGIN_KEY = {
  /**
   * Cache key for the bundled TypeScript parser plugin.
   */
  typescript: 'typescript',

  /**
   * Cache key for the bundled HTML parser plugin.
   */
  html: 'html',

  /**
   * Cache key for the bundled PostCSS parser plugin.
   */
  postcss: 'postcss',

  /**
   * Cache key for the XML parser plugin.
   */
  xml: 'xml',

  /**
   * Cache key for the bundled YAML parser plugin.
   */
  yaml: 'yaml',

  /**
   * Cache key for the TOML parser plugin.
   */
  toml: 'toml',

  /**
   * Cache key for the PHP parser plugin.
   */
  php: 'php',

  /**
   * Cache key for the Java parser plugin.
   */
  java: 'java',

  /**
   * Cache key for the Pug parser plugin.
   */
  pug: 'pug',

  /**
   * Cache key for the Svelte parser plugin.
   */
  svelte: 'svelte',

  /**
   * Cache key for the bundled GraphQL parser plugin.
   */
  graphql: 'graphql',

  /**
   * Cache key for the bundled Markdown parser plugin.
   */
  markdown: 'markdown',
} as const

/**
 * Prettier plugin loader configuration.
 */
const prettierLoaders = {
  [PRETTIER_PLUGIN_KEY.typescript]() {
    return interopDefault(import('prettier/plugins/typescript'))
  },
  [PRETTIER_PLUGIN_KEY.html]() {
    return interopDefault(import('prettier/plugins/html'))
  },
  [PRETTIER_PLUGIN_KEY.markdown]() {
    return interopDefault(import('prettier/plugins/markdown'))
  },
  [PRETTIER_PLUGIN_KEY.postcss]() {
    return interopDefault(import('prettier/plugins/postcss'))
  },
  [PRETTIER_PLUGIN_KEY.yaml]() {
    return interopDefault(import('prettier/plugins/yaml'))
  },
  [PRETTIER_PLUGIN_KEY.graphql]() {
    return interopDefault(import('prettier/plugins/graphql'))
  },
  [PRETTIER_PLUGIN_KEY.xml]() {
    return interopDefault(import('@prettier/plugin-xml'))
  },
  [PRETTIER_PLUGIN_KEY.php]() {
    return interopDefault(import('@prettier/plugin-php/standalone'))
  },
  [PRETTIER_PLUGIN_KEY.java]() {
    return interopDefault(import('prettier-plugin-java'))
  },
  [PRETTIER_PLUGIN_KEY.svelte]() {
    return interopDefault(import('prettier-plugin-svelte/browser'))
  },
  [PRETTIER_PLUGIN_KEY.toml]() {
    return interopDefault(import('prettier-plugin-toml'))
  },
  [PRETTIER_PLUGIN_KEY.pug]() {
    return interopDefault(import('@prettier/plugin-pug'))
  },
} as const

/**
 * Map language ids to their shared Prettier plugin cache key.
 */
const PRETTIER_PLUGIN_KEY_BY_LANGUAGE: Partial<
  Record<LanguageId, keyof typeof prettierLoaders>
> = {
  [LANGUAGE_ID.typescript]: PRETTIER_PLUGIN_KEY.typescript,
  [LANGUAGE_ID.html]: PRETTIER_PLUGIN_KEY.html,
  [LANGUAGE_ID.vue]: PRETTIER_PLUGIN_KEY.html,
  [LANGUAGE_ID.angular]: PRETTIER_PLUGIN_KEY.html,
  [LANGUAGE_ID.markdown]: PRETTIER_PLUGIN_KEY.markdown,
  [LANGUAGE_ID.css]: PRETTIER_PLUGIN_KEY.postcss,
  [LANGUAGE_ID.less]: PRETTIER_PLUGIN_KEY.postcss,
  [LANGUAGE_ID.scss]: PRETTIER_PLUGIN_KEY.postcss,
  [LANGUAGE_ID.xml]: PRETTIER_PLUGIN_KEY.xml,
  [LANGUAGE_ID.yaml]: PRETTIER_PLUGIN_KEY.yaml,
  [LANGUAGE_ID.php]: PRETTIER_PLUGIN_KEY.php,
  [LANGUAGE_ID.java]: PRETTIER_PLUGIN_KEY.java,
  [LANGUAGE_ID.svelte]: PRETTIER_PLUGIN_KEY.svelte,
  [LANGUAGE_ID.graphql]: PRETTIER_PLUGIN_KEY.graphql,
  [LANGUAGE_ID.toml]: PRETTIER_PLUGIN_KEY.toml,
  [LANGUAGE_ID.pug]: PRETTIER_PLUGIN_KEY.pug,
}

/**
 * Load the Prettier plugin for a language id.
 *
 * @param languageId - Language id to load.
 * @returns Prettier plugin when available.
 */
export async function loadPrettierPlugin(languageId?: LanguageId) {
  if (!languageId) {
    return
  }

  const cacheKey = PRETTIER_PLUGIN_KEY_BY_LANGUAGE[languageId]

  if (!cacheKey) {
    return
  }

  if (prettierPluginCache.has(cacheKey)) {
    return prettierPluginCache.get(cacheKey)
  }

  const loader = prettierLoaders[cacheKey]
  if (!loader) {
    return
  }

  const prettierPlugin = resolvePrettierPlugin(await loader())
  if (prettierPlugin) {
    prettierPluginCache.set(cacheKey, prettierPlugin)
  }

  return prettierPlugin
}
