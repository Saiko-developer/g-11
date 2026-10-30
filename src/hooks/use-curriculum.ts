import { LOCAL_CURRICULUM, type Curriculum } from "@/lib/curriculum";

/**
 * Returns the Unit 1 curriculum straight from the bundled local data files in
 * `src/data`. No network / database access — lesson content is 100% local.
 */
export function useCurriculum(): Curriculum {
  return LOCAL_CURRICULUM;
}
