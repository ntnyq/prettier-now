import type { ProtocolWithReturn } from 'webext-bridge'
import type { Command } from '@/modules/command'

declare module 'webext-bridge' {
  // user custom type
  export interface ExtContext {}

  export interface ProtocolMap {
    triggerCommand: ProtocolWithReturn<{ command: Command }, void>
  }
}
