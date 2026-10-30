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
