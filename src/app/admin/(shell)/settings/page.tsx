import { SiteHeader } from '@/components/site-header';
import { getSiteSettings } from '@/entities/siteSettings/getSiteSettings';

import { updateSiteSettings } from './actions';
import { SiteSettingsForm } from './SiteSettingsForm';

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <SiteHeader title="Настройки" />
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <SiteSettingsForm
          action={updateSiteSettings}
          defaultValues={{
            showRoutesSection: settings.showRoutesSection,
            showBonusesSection: settings.showBonusesSection,
          }}
        />
      </div>
    </>
  );
}
