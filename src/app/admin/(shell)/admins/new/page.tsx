import { SiteHeader } from '@/components/site-header';
import { requireSuperadminSession } from '@/core/auth/requireSuperadmin';

import { AdminUserForm } from '../AdminUserForm';
import { createAdminUser } from '../actions';

export default async function NewAdminPage() {
  await requireSuperadminSession();

  return (
    <>
      <SiteHeader title="Новый админ" />
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <AdminUserForm action={createAdminUser} submitLabel="Создать" isNew />
      </div>
    </>
  );
}
