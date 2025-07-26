# Supabase CLI Commands Reference

## Core Database Commands

### Migration Management
- `npx supabase@latest migration new <name>` - Create new migration file
- `npx supabase@latest migration list` - Show migration status and history
- `npx supabase@latest migration repair --status <status> <migration>` - Repair migration history
- `npx supabase@latest migration squash` - Consolidate local migrations

### Database Operations
- `npx supabase@latest db push --linked` - Apply local migrations to remote database
- `npx supabase@latest db pull --linked` - Pull schema changes from remote database
- `npx supabase@latest db reset --linked` - Reset remote database and apply migrations
- `npx supabase@latest db diff --linked` - Compare local vs remote schema
- `npx supabase@latest db lint --linked` - Check database schema for errors

### Useful Flags
- `--linked` - Target the linked remote project
- `--local` - Target local development database
- `--dry-run` - Preview changes without applying
- `--include-seed` - Include seed data in operations
- `--db-url <url>` - Specify custom database connection string

## Project Management

### Setup Commands
- `npx supabase@latest init` - Initialize local project
- `npx supabase@latest login` - Login to Supabase
- `npx supabase@latest link --project-ref <ref>` - Link to remote project
- `npx supabase@latest status` - Show project status

### Development Commands
- `npx supabase@latest start` - Start local development stack
- `npx supabase@latest stop` - Stop local development stack

## Other Useful Commands

### Type Generation
- `npx supabase@latest gen types typescript --linked` - Generate TypeScript types

### Functions
- `npx supabase@latest functions new <name>` - Create new Edge Function
- `npx supabase@latest functions deploy <name>` - Deploy function

### Secrets
- `npx supabase@latest secrets list --linked` - List environment variables
- `npx supabase@latest secrets set --linked <name>=<value>` - Set environment variable

## Important Notes

1. **No Direct SQL Execution**: Supabase CLI doesn't support direct SQL execution for security reasons
2. **Use Migrations**: Always use migration files for database schema changes
3. **Link First**: Always link your project with `supabase link` before database operations
4. **Test Locally**: Use `--local` flag to test changes before applying to production

## Common Workflows

### Applying Schema Changes
1. `npx supabase@latest migration new my_change`
2. Edit the generated migration file
3. `npx supabase@latest db push --linked`

### Syncing with Remote
1. `npx supabase@latest db pull --linked`
2. Review generated migration files
3. Commit changes to version control

### Emergency Reset
1. `npx supabase@latest db reset --linked`
2. Confirms before applying - be careful!