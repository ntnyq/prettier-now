export const i18n = {
  t(key: string, params?: unknown[]) {
    return params?.length ? `${key}:${params.join(',')}` : key
  },
}
