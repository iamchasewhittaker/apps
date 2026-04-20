import type { Compliance } from '@/lib/types';

interface Props {
  compliance: Compliance;
}

const ITEMS: { key: keyof Compliance; label: string }[] = [
  { key: 'has_readme', label: 'README' },
  { key: 'has_claude_md', label: 'CLAUDE.md' },
  { key: 'has_mvp_audit', label: 'MVP Audit' },
  { key: 'has_changelog', label: 'Changelog' },
  { key: 'has_handoff', label: 'Handoff' },
  { key: 'has_agents', label: 'Agents' },
  { key: 'has_project_instructions', label: 'Project Instructions' },
];

export default function ComplianceChecklist({ compliance }: Props) {
  return (
    <ul className="space-y-1.5">
      {ITEMS.map(({ key, label }) => (
        <li key={key} className="flex items-center gap-2 text-sm">
          {compliance[key] ? (
            <span className="text-success">&#10003;</span>
          ) : (
            <span className="text-danger">&#10005;</span>
          )}
          <span className={compliance[key] ? 'text-white' : 'text-dim'}>
            {label}
          </span>
        </li>
      ))}
    </ul>
  );
}
