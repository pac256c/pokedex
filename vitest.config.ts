import { defineConfig } from "vitest/config";
import fs from "node:fs";
import path from "node:path";

const OUTPUT_DIR = path.join(process.cwd(), "out/test-logs");

function safeName(value: string): string {
  return value.replace(/[^a-zA-Z0-9-_.]/g, "_");
}

function logPathForEntity(entity: any): string {
  if (!entity || entity.type === "module") {
    return path.join(OUTPUT_DIR, "global.log");
  }

  const baseSuiteFile = path.basename(entity.module?.moduleId ?? "suite");
  const testName = safeName(entity.name ?? "test");
  const sequenceName = (entity.type === "test" && entity.parent?.type === "suite") ? safeName(entity.parent.name) : testName;

  return path.join(OUTPUT_DIR, `${safeName(baseSuiteFile)}.${testName}`, `${sequenceName}.log`);
}

class PerTestLogReporter {
  onInit() {
    fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  onTestCaseReady(testCase: any) {
    const filePath = logPathForEntity(testCase);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, "");
  }

  onTestCaseResult(testCase: any) {
    const filePath = logPathForEntity(testCase);
    const result = testCase.result();
    const diagnostic = testCase.diagnostic();
    const symbol =
      result.state === "passed" ? "✓" : result.state === "failed" ? "✗" : "-";
    const duration =
      diagnostic?.duration != null ? ` (${Math.round(diagnostic.duration)}ms)` : "";

    fs.appendFileSync(filePath, `\n${symbol} ${testCase.name}${duration}\n`);

    if (result.state === "failed") {
      for (const error of result.errors ?? []) {
        fs.appendFileSync(filePath, `${error.name ?? "Error"}: ${error.message}\n`);
        if (error.stack) fs.appendFileSync(filePath, `${error.stack}\n`);
        if (error.diff) fs.appendFileSync(filePath, `${error.diff}\n`);
      }
    }
  }
}

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    reporters: ["default", new PerTestLogReporter()],
    //prevents running compiled copies of the tests
    //exclude: ["**/node_modules", "out/**"],

    onConsoleLog(log, type, entity) {
      const filePath = logPathForEntity(entity);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      const timestamp = new Date().toISOString();
      fs.appendFileSync(filePath, `[${timestamp}] [${type.toUpperCase()}]: ${log}\n`);
    },
  },
});
