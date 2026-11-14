import { createFileRoute } from '@tanstack/react-router'
import { ApiLabPage } from '../pages/api-lab-page'
export const Route = createFileRoute('/api-lab')({ component: ApiLabPage })
