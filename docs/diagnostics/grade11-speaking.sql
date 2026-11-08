-- Read-only checks for the existing shared Grade 10/11 speaking backend.
-- Run in the project's SQL editor if a signed-in student receives
-- speaking_service_unavailable. This does not call a paid/session-opening RPC.
WITH expected(name) AS (
  VALUES ('start_speaking_session'), ('speaking_turn'), ('speaking_unit_status')
)
SELECT expected.name,
       p.oid IS NOT NULL AS function_exists,
       pg_get_function_identity_arguments(p.oid) AS arguments,
       CASE WHEN p.oid IS NOT NULL
         THEN has_function_privilege('authenticated', p.oid, 'EXECUTE')
       END AS authenticated_can_execute
FROM expected
LEFT JOIN pg_namespace n ON n.nspname = 'public'
LEFT JOIN pg_proc p ON p.pronamespace = n.oid AND p.proname = expected.name
ORDER BY expected.name, arguments;
-- Expected caller arguments match the current shared implementation:
-- start_speaking_session(p_unit ...), speaking_turn(p_session ...),
-- speaking_unit_status(p_unit ...).
-- Missing RPC/schema-cache/grant errors must be repaired against the existing
-- project's definitions. Do not bypass session ownership, credits or quotas.
