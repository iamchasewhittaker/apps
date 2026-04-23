'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ProjectPickerModal,
  type PickerProject,
} from './ProjectPickerModal';
import {
  readVisibleSet,
  clearVisibleSet,
  VISIBLE_CHANGE_EVENT,
} from '@/lib/visible-projects';

interface Props {
  projects: PickerProject[];
}

export function ProjectPickerControls({ projects }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[] | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSelected(readVisibleSet());
    setHydrated(true);
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string[] | null>).detail;
      setSelected(detail && detail.length ? detail : null);
    };
    window.addEventListener(VISIBLE_CHANGE_EVENT, handler);
    return () => window.removeEventListener(VISIBLE_CHANGE_EVENT, handler);
  }, []);

  function handleClear() {
    if (!confirm('Show all projects again? You\u2019ll be prompted to re-pick on the next visit.')) {
      return;
    }
    clearVisibleSet();
    router.refresh();
  }

  const total = projects.length;
  const count = selected?.length ?? total;

  return (
    <div className="space-y-3">
      <p className="text-sm text-foreground">
        {hydrated ? (
          selected === null ? (
            <>
              Showing <span className="text-accent font-semibold">all {total}</span>{' '}
              projects (no selection saved).
            </>
          ) : (
            <>
              Showing <span className="text-accent font-semibold">{count}</span>{' '}
              of {total} projects.
            </>
          )
        ) : (
          <>Loading&hellip;</>
        )}
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-md border border-accent bg-accent/10 px-4 py-2 text-sm font-semibold text-accent hover:bg-accent/20 transition-colors"
        >
          Edit visible projects
        </button>
        {hydrated && selected !== null && (
          <button
            type="button"
            onClick={handleClear}
            className="rounded-md border border-border px-4 py-2 text-sm text-muted hover:border-accent/40 hover:text-foreground transition-colors"
          >
            Show all projects
          </button>
        )}
      </div>

      <ProjectPickerModal
        projects={projects}
        open={open}
        initial={selected}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
