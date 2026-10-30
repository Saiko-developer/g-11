import { LOCAL_CURRICULUM_UNIT5, type Unit5Curriculum } from "@/lib/curriculumUnit5";

/**
 * Returns the Unit 5 (Trains) curriculum straight from the bundled local data
 * files in `src/data`. No network / database access.
 */
export function useCurriculumUnit5(): Unit5Curriculum {
  return LOCAL_CURRICULUM_UNIT5;
}
