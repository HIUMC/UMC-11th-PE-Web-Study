import { createFileRoute, useSearch } from '@tanstack/react-router'
import { StorageLabPage } from '../pages/storage-lab-page'

export const Route = createFileRoute('/storage-lab')({
  validateSearch: (search): { storage: 'local' | 'session' } => ({ storage: search.storage === 'session' ? 'session' : 'local' }),
  component: function StorageLabRoute() {
    const { storage } = useSearch({ from: '/storage-lab' })
    return <StorageLabPage key={storage} mode={storage} />
  },
})
