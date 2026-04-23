export const dynamic = 'force-dynamic';

import { createServerClient } from '@/lib/supabase';
import { ProjectPickerControls } from '@/components/ProjectPickerControls';
import type { PickerProject } from '@/components/ProjectPickerModal';
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
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-accent">Settings</h1>
        <p className="text-sm text-muted">
          Personal preferences, persisted in this browser.
        </p>
      </div>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="font-mono-label text-[11px] text-muted">Visible projects</h2>
          <p className="text-sm text-foreground">
            Pick which projects appear on Fleet, WIP, Captain&rsquo;s Log, Charts, and Showcase.
            Direct links to <code className="text-accent">/ship/&lt;slug&gt;</code> still work for everything.
          </p>
        </div>
        <ProjectPickerControls projects={projects} />
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="font-mono-label text-[11px] text-muted">Theme mode</h2>
          <p className="text-sm text-foreground">
            Switch between nautical vocabulary and plain project names. Colors and layout stay the same.
          </p>
        </div>
        <ThemeModeToggle />
      </section>
    </div>
  );
}
