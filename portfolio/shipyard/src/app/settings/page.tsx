export const dynamic = 'force-dynamic';

import { createServerClient } from '@/lib/supabase';
import { ProjectPickerControls } from '@/components/ProjectPickerControls';
import type { PickerProject } from '@/components/ProjectPickerModal';
import { ModeHeading } from '@/components/ModeHeading';
import { ThemeModeToggle } from './ThemeModeToggle';

export default async function SettingsPage() {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from('projects')
    .select('slug,name,type,family,status')
    .order('name');
  const projects = (data ?? []) as PickerProject[];

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <ModeHeading
        labelKey="settings"
        subtitle="Personal preferences, persisted in this browser."
      />

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="font-mono-label text-xs text-gold uppercase tracking-wider">Visible projects</h2>
          <p className="text-sm text-white">
            Pick which projects appear on Fleet, WIP, Captain&rsquo;s Log, Charts, and Showcase.
            Direct links to <code className="text-gold">/ship/&lt;slug&gt;</code> still work for everything.
          </p>
        </div>
        <ProjectPickerControls projects={projects} />
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="font-mono-label text-xs text-gold uppercase tracking-wider">Theme mode</h2>
          <p className="text-sm text-white">
            Switch between nautical vocabulary and plain project names. Colors and layout stay the same.
          </p>
        </div>
        <ThemeModeToggle />
      </section>
    </div>
  );
}
