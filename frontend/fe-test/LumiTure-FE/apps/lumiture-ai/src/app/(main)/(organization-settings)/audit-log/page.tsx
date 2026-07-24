import { Suspense } from 'react';

import { AuditLogHydration } from './components/AuditLog/AuditLogHydration';
import { AuditLogSkeleton } from './components/AuditLog/AuditLogSkeleton';

export default function AuditLogPage() {
  return (
    <Suspense fallback={<AuditLogSkeleton />}>
      <AuditLogHydration />
    </Suspense>
  );
}
