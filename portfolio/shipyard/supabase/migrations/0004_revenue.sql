-- Add monetization signal columns to projects table
alter table projects add column if not exists revenue_potential int check (revenue_potential between 1 and 5);
alter table projects add column if not exists monthly_revenue_usd numeric(10,2);

create index if not exists projects_revenue_potential_idx on projects (revenue_potential desc nulls last);
