import { LOCAL_CURRICULUM_UNIT2, type Unit2Curriculum } from "@/lib/curriculumUnit2";

/**
 * Returns the Unit 2 (Literature) curriculum straight from the bundled local
 * data files in `src/data`. No network / database access.
 */
export function useCurriculumUnit2(): Unit2Curriculum {
  return LOCAL_CURRICULUM_UNIT2;
}
