import { StorageLabPage } from '../../screens/storage-lab-page'

export const metadata = { title: 'Web Storage 실습' }

export default async function Page({ searchParams }: PageProps<'/storage-lab'>) {
  const { storage } = await searchParams
  const mode = storage === 'session' ? 'session' : 'local'
  return <StorageLabPage key={mode} mode={mode} />
}
