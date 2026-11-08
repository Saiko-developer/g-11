import { signInWithGoogle } from "@/components/RequireSignIn";

/** Preserve the Grade 11 section through the existing validated Google login flow. */
export async function signInToGrade11() {
  try {
    localStorage.setItem("postLoginRedirect", window.location.pathname + window.location.search);
  } catch {
    /* Storage is optional. */
  }
  return signInWithGoogle();
}
