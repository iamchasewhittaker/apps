export type ProjectType = 'web' | 'ios' | 'library' | 'cli' | 'desktop';
export type ProjectFamily = 'clarity' | 'standalone' | 'portfolio' | 'archived';
export type ProjectStatus = 'active' | 'stalled' | 'frozen' | 'archived';
export type ReviewKind = 'weekly' | 'monthly' | 'quarterly';
export type LearningSource = 'manual' | 'auto:commit' | 'auto:changelog' | 'auto:todo' | 'auto:audit';
export type ThemeKind = 'portfolio_thesis' | 'narrative_thread' | 'cross_app_pattern' | 'common_input';

export interface Compliance {
  has_readme: boolean;
  has_claude_md: boolean;
  has_mvp_audit: boolean;
  has_changelog: boolean;
  has_handoff: boolean;
  has_agents: boolean;
  has_project_instructions: boolean;
}

export interface Project {
  slug: string;
  name: string;
  type: ProjectType;
  family: ProjectFamily;
  status: ProjectStatus;
  location: string;
  tech_stack: string;
  framework_versions: Record<string, string> | null;
  mvp_step: number | null;
  mvp_step_claimed: string | null;
  mvp_step_actual: number | null;
  last_commit_date: string | null;
  days_since_commit: number | null;
  feature_count: number | null;
  loc_count: number | null;
  disk_size_mb: number | null;
  live_url: string | null;
  has_live_url: boolean;
  vercel_project: string | null;
  github_url: string | null;
  linear_project_url: string | null;
  compliance_score: number;
  compliance: Compliance;
  jtbd_primary: string | null;
  recommendation: string | null;
  next_action: string | null;
  localstorage_keys: string[];
  supabase_tables: string[];
  external_apis: string[];
  secrets_p0_count: number;
  breaking_change_risk: string | null;
  features_list: string | null;
  created_at: string;
  updated_at: string;
}

export interface Blocker {
  id: string;
  project_slug: string;
  text: string;
  created_at: string;
  resolved_at: string | null;
}

export interface Scan {
  id: string;
  started_at: string;
  finished_at: string | null;
  projects_found: number;
  projects_updated: number;
  learnings_captured: number;
  themes_updated: number;
  errors: Record<string, string>[] | null;
}

export interface Review {
  id: string;
  kind: ReviewKind;
  started_at: string;
  finished_at: string | null;
  stats: ReviewStats | null;
  reflection_id: string | null;
  csv_blob: string | null;
}

export interface ReviewStats {
  ships_with_commits: number;
  total_commits: number;
  lines_changed: number;
  ships_advanced: string[];
  new_learnings: number;
  wip_count: number;
  compliance_avg: number;
  top_active_ship: string | null;
  stalled_ships?: string[];
  step_deltas?: Record<string, { from: number; to: number }>;
}

export interface ReviewCadence {
  kind: ReviewKind;
  cadence_days: number;
  last_review_at: string | null;
  reminded_at: string | null;
}

export interface Learning {
  id: string;
  project_slug: string | null;
  review_id: string | null;
  text: string;
  tags: string[];
  scripture_ref: string | null;
  source: LearningSource;
  reviewed: boolean;
  raw_source_ref: string | null;
  created_at: string;
  updated_at: string;
}

export interface Theme {
  id: string;
  slug: string;
  title: string;
  kind: ThemeKind;
  description: string;
  project_slugs: string[];
  auto_generated: boolean;
  created_at: string;
  updated_at: string;
}

export interface WipDecision {
  id: string;
  active_slug: string;
  stalled_slugs: string[];
  decided_at: string;
}

// Dashboard stats
export interface FleetStats {
  total: number;
  building: number;
  shipped: number;
  drydock: number;
  archived: number;
  compliance_avg: number;
}

// Review countdown chip state
export type ChipState = 'neutral' | 'amber' | 'red';

export interface ReviewChip {
  kind: ReviewKind;
  days_remaining: number;
  state: ChipState;
  last_review_at: string | null;
}
