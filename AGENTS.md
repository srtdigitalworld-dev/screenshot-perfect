<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- Invitation content (couple, events, gallery paths) lives in one `content` jsonb column on `invitations`; templates are pure themes (`.theme-*` classes) over the same data, so switching design never loses data.
- Guest pages (`/i/$slug`) are public SSR via a publishable-key server fn; couple tools live under `_authenticated` and talk to the DB with the browser client under RLS.
- Photos sit in a private bucket and are shown via signed URLs (workspace blocks public buckets).
- RSVP counting/CSV logic lives in `src/lib/templates.ts` and is covered by `src/test/rsvp.test.ts`.
