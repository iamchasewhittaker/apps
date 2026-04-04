# Sunsama MCP Guide

This guide shows how to use the `user-sunsama` MCP server from Cursor with concrete request examples.

## What this MCP gives you

The Sunsama MCP exposes:
- **Resources** (read-only data by URI), such as authentication status, profile info, day tasks, and backlog folders.
- **Tools** (actions), such as creating tasks, moving tasks, starting/stopping timers, and calendar operations.

## First-run checklist

1. Confirm the server identifier is `user-sunsama`.
2. Check authentication before doing anything else.
3. Read basic user context (`sunsama://me`) so date/time actions use the right timezone.
4. Use resource discovery to see what data endpoints are available.

## Core MCP call format

Use this structure when calling Sunsama tools:

```json
{
  "server": "user-sunsama",
  "toolName": "<tool_name>",
  "arguments": {
    "...": "..."
  }
}
```

## Resource workflow (discover + read)

### 1) List available resources

```json
{
  "server": "user-sunsama",
  "toolName": "list_resources"
}
```

### 2) Read auth status

```json
{
  "server": "user-sunsama",
  "toolName": "read_resource",
  "arguments": {
    "uri": "sunsama://user/authentication"
  }
}
```

Expected response when signed in:
- `authenticated`

### 3) Read user context

```json
{
  "server": "user-sunsama",
  "toolName": "read_resource",
  "arguments": {
    "uri": "sunsama://me"
  }
}
```

Use this to get timezone/current day before date-based operations.

### 4) Read tasks for a day (templated URI)

```json
{
  "server": "user-sunsama",
  "toolName": "read_resource",
  "arguments": {
    "uri": "sunsama://tasks/2026-03-25"
  }
}
```

Date format is `YYYY-MM-DD`.

## Common task workflows

### Create a task for today

`create_task` requires: `title`, `day`, `alreadyInTaskList`.

```json
{
  "server": "user-sunsama",
  "toolName": "create_task",
  "arguments": {
    "title": "Draft launch email",
    "day": "2026-03-25",
    "alreadyInTaskList": false,
    "timeEstimate": 45,
    "notes": "<p>Include CTA and send by afternoon.</p>",
    "position": "bottom"
  }
}
```

### Move a task to another day

```json
{
  "server": "user-sunsama",
  "toolName": "move_task_to_day",
  "arguments": {
    "taskId": "TASK_ID_HERE",
    "calendarDay": "2026-03-26"
  }
}
```

### Start and stop a timer

Start:

```json
{
  "server": "user-sunsama",
  "toolName": "start_task_timer",
  "arguments": {
    "taskId": "TASK_ID_HERE"
  }
}
```

Stop:

```json
{
  "server": "user-sunsama",
  "toolName": "stop_task_timer",
  "arguments": {
    "taskId": "TASK_ID_HERE"
  }
}
```

You can read current timer state from:
- `sunsama://active-timer`

### Mark work complete

```json
{
  "server": "user-sunsama",
  "toolName": "mark_task_as_completed",
  "arguments": {
    "taskId": "TASK_ID_HERE"
  }
}
```

## Backlog workflow

### Read backlog folders

```json
{
  "server": "user-sunsama",
  "toolName": "read_resource",
  "arguments": {
    "uri": "sunsama://backlog/folders"
  }
}
```

### Create a backlog task

```json
{
  "server": "user-sunsama",
  "toolName": "create_task",
  "arguments": {
    "title": "Research referral program",
    "day": "2026-03-25",
    "alreadyInTaskList": false,
    "backlog": {
      "timeBucket": "in the next month"
    }
  }
}
```

## Calendar workflow

Useful calendar tools include:
- `create_calendar_event`
- `move_calendar_event`
- `delete_calendar_event`
- `timebox_a_task_to_calendar`
- `accept_meeting_invite`
- `decline_meeting_invite`

For predictable scheduling:
1. Read the day context (`sunsama://tasks/{calendarDay}` and/or calendar resource).
2. Create or move the task.
3. Timebox the task to calendar.

## High-value tools to know

Task management:
- `create_task`, `search_tasks`, `edit_task_title`, `edit_task_due_date`, `edit_task_time_estimate`
- `move_task_to_day`, `move_task_to_backlog`, `move_task_from_backlog`
- `mark_task_as_completed`, `mark_task_as_incomplete`, `delete_task`, `restore_task`, `unarchive_task`

Subtasks:
- `add_subtasks_to_task`, `edit_subtask_title`, `mark_subtask_as_completed`, `mark_subtask_as_incomplete`

Focus/time:
- `start_task_timer`, `stop_task_timer`

Planning/journaling:
- `create_weekly_objective`, `align_task_with_objective`, `get_daily_highlights`

## Error handling and troubleshooting

- **Auth failures**: call `read_resource` with `sunsama://user/authentication` first.
- **No results for date URIs**: verify date format is exactly `YYYY-MM-DD`.
- **Task not found**: run `search_tasks` to locate the correct `taskId`.
- **Sort order issues on move**: omit `sortOrder` unless you need exact positioning.
- **Unexpected calendar behavior**: inspect user calendars from `sunsama://me` and confirm default calendar settings.

## Recommended operating pattern

For robust automations, use this sequence:
1. `read_resource(sunsama://user/authentication)`
2. `read_resource(sunsama://me)`
3. Read the target day/context resource
4. Perform write action (`create_task`, `move_task_to_day`, etc.)
5. Re-read the day resource to verify final state

This keeps Sunsama operations deterministic and easier to debug.
