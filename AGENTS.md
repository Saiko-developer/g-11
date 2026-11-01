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
- Backend is Lovable Cloud; app logic lives in SECURITY DEFINER SQL functions (quotas, top-ups, classrooms) called via RPC — keeps limits server-enforced.
- Daily limits reset on Myanmar time via `public.mm_today()` — keeps DB and admin views consistent.
- Sign-in is Google only via the Lovable auth module; admins come from `user_roles` plus the `is_main_admin` email allowlist in SQL.
- AuthGate owns the single root auth subscription, validates users before restoring internal destinations, and clears cached private data on sign-out — prevents stale sessions and unsafe OAuth redirects.
- New Google accounts create profiles and protected roles through the auth lifecycle trigger invoking `public.handle_new_user` — keeps account initialization server-owned.
- Payment settings SELECT access is limited to checkout configuration `id = 1` for authenticated customers and all rows for SQL-verified admins; this preserves credit purchases without exposing other configuration rows.
# Project Rules
- Lesson audio MP3s live in public/audio/unitN.mp3 (real files, committed) — asset pointers broke on remix/repo import because they are tied to the old project.
