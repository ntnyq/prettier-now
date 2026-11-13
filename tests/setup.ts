import { beforeEach } from 'vitest'

// happy-dom does not implement Web Locks. Keep its origin-wide FIFO behavior.
beforeEach(() => {
  const queues = new Map<string, Promise<unknown>>()
  Object.defineProperty(navigator, 'locks', {
    configurable: true,
    value: {
      request(name: string, callback: () => unknown) {
        const pending = (queues.get(name) ?? Promise.resolve()).then(callback)
        queues.set(
          name,
          pending.catch(() => {}),
        )
        return pending
      },
    },
  })
})
