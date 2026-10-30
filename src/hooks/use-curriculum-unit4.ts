import { LOCAL_CURRICULUM_UNIT4, type Unit4Curriculum } from "@/lib/curriculumUnit4";

/**
 * Returns the Unit 4 (Painting) curriculum straight from the bundled local data
 * files in `src/data`. No network / database access.
 */
export function useCurriculumUnit4(): Unit4Curriculum {
  return LOCAL_CURRICULUM_UNIT4;
}
