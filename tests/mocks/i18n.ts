export const i18n = {
  t: (key: string, params?: unknown[]) =>
    params?.length ? `${key}:${params.join(',')}` : key,
}
