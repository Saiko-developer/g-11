import { LOCAL_CURRICULUM_UNIT3, type Unit3Curriculum } from "@/lib/curriculumUnit3";

/**
 * Returns the Unit 3 (Zero) curriculum straight from the bundled local data
 * files in `src/data`. No network / database access.
 */
export function useCurriculumUnit3(): Unit3Curriculum {
  return LOCAL_CURRICULUM_UNIT3;
}
