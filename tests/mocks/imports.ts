export const browser = {
  runtime: {
    getURL: (path: string) => path,
  },
}

export const storage = {
  getItem: async () => null,
  setItem: async () => {},
}
