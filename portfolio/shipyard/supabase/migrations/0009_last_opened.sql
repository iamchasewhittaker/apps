-- Track when apps were last opened/used beyond just git commits
alter table projects add column if not exists last_deployed_at timestamptz;
alter table projects add column if not exists last_built_at timestamptz;
alter table projects add column if not exists last_device_deploy_at timestamptz;
alter table projects add column if not exists last_opened_at timestamptz;
alter table projects add column if not exists days_since_opened int;
