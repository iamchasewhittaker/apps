-- Add retirement tracking columns to projects table
alter table projects add column if not exists retired_at timestamptz;
alter table projects add column if not exists retire_reason text;
