import { createFileRoute } from '@tanstack/react-router'
import { MemberApiPage } from '../pages/member-api-page'
export const Route = createFileRoute('/member-api')({ component: MemberApiPage })
