import { useWorkspaceStore } from '@/stores/workspace'

export function useFileHandler() {
  const workspaceStore = useWorkspaceStore()

  async function loadFileList(files?: FileList | null) {
    if (!files?.length) {
      return
    }

    await workspaceStore.loadFileList(files)
  }

  return {
    loadFileList,
  }
}
