'use client';

import { useEffect, useState } from 'react';
import {
  ProjectPickerModal,
  type PickerProject,
} from './ProjectPickerModal';
import {
  readVisibleSet,
  VISIBLE_OPEN_EVENT,
} from '@/lib/visible-projects';

interface Props {
  projects: PickerProject[];
}

export function ProjectPickerAutoOpen({ projects }: Props) {
  const [open, setOpen] = useState(false);
  const [firstVisit, setFirstVisit] = useState(false);
  const [initial, setInitial] = useState<string[] | null>(null);

  useEffect(() => {
    const current = readVisibleSet();
    if (current === null) {
      setFirstVisit(true);
      setOpen(true);
    }

    function handleOpen() {
      const stored = readVisibleSet();
      setInitial(stored);
      setFirstVisit(false);
      setOpen(true);
    }

    window.addEventListener(VISIBLE_OPEN_EVENT, handleOpen);
    return () => window.removeEventListener(VISIBLE_OPEN_EVENT, handleOpen);
  }, []);

  return (
    <ProjectPickerModal
      projects={projects}
      open={open}
      initial={firstVisit ? null : initial}
      firstVisit={firstVisit}
      onClose={() => setOpen(false)}
    />
  );
}
