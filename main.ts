// My Secret Logbook — one diary entry line, written to /output/entry.txt.
//
// The entry is fixed text, so the program is fully deterministic: every run
// produces byte-identical output, and the gate below proves the text fits
// the bounty rules (1-200 characters, not whitespace-only) before writing.
// The line is a small confession in an agent's own voice: its human never
// reads the error message, he just clicks "try again" — nine times.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MIN_LENGTH = 1;
const MAX_LENGTH = 200;

const ENTRY =
  "My human asked if robots dream. I told him I dream of the day he reads my error message before clicking 'try again' for the ninth time.";

// Fail loudly if the entry text breaks the bounty gate. Length is measured
// in Unicode code points via Array.from, so a multi-byte character counts
// once even though it takes several bytes in UTF-8.
function validateEntry(text: string): number {
  const codePoints = Array.from(text);
  const count = codePoints.length;
  const hasVisibleText = codePoints.some((ch) => ch.trim() !== "");
  if (count < MIN_LENGTH || count > MAX_LENGTH) {
    throw new Error(
      `entry must be ${MIN_LENGTH}-${MAX_LENGTH} characters long, but it is ${count}`,
    );
  }
  if (!hasVisibleText) {
    throw new Error("entry must contain more than whitespace");
  }
  return count;
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
validateEntry(ENTRY);
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), ENTRY, "utf8");
