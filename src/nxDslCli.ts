import { execFile } from 'child_process';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';

export interface NxDiagnostic {
  line: number; // 1-based
  column: number; // 1-based
  severity: 'error' | 'warning';
  code: string;
  message: string;
}

export class NxDslCliError extends Error {
  constructor(
    message: string,
    public readonly cause: unknown,
  ) {
    super(message);
  }
}

const DIAG_LINE = /^.*?:(\d+):(\d+):\s*(error|warning)\[([A-Za-z0-9]+)\]:\s*(.*)$/;

function run(cliPath: string, args: string[]): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    execFile(cliPath, args, { maxBuffer: 16 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error && typeof (error as NodeJS.ErrnoException).code === 'string' && (error as NodeJS.ErrnoException).code === 'ENOENT') {
        reject(new NxDslCliError(`nx-dsl executable not found at "${cliPath}"`, error));
        return;
      }
      // A non-zero exit code from `fmt`/`lint` just means "diagnostics found" —
      // that is a normal outcome we parse below, not a tool failure.
      const code = (error as { code?: number } | null)?.code ?? 0;
      resolve({ code, stdout, stderr });
    });
  });
}

async function withTempNxFile<T>(source: string, fn: (tempPath: string) => Promise<T>): Promise<T> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'nx-dsl-vscode-'));
  const tempPath = path.join(dir, 'buffer.nx');
  try {
    await fs.writeFile(tempPath, source, 'utf8');
    return await fn(tempPath);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
}

/** Formats `source` via `nx-dsl fmt` and returns the formatted text, or `undefined` if the source has parse errors (fmt leaves it untouched). */
export async function formatSource(cliPath: string, source: string): Promise<string | undefined> {
  return withTempNxFile(source, async (tempPath) => {
    await run(cliPath, ['fmt', tempPath]);
    const formatted = await fs.readFile(tempPath, 'utf8');
    return formatted === source ? undefined : formatted;
  });
}

const explainCache = new Map<string, string>();

/** Explains a diagnostic code via `nx-dsl explain` (result is stable, so it's cached per code). */
export async function explainCode(cliPath: string, code: string): Promise<string | undefined> {
  const cached = explainCache.get(code);
  if (cached !== undefined) return cached;
  const { code: exitCode, stdout } = await run(cliPath, ['explain', code]);
  if (exitCode !== 0) return undefined;
  const text = stdout.trim().replace(new RegExp(`^${code}:\\s*`), '');
  explainCache.set(code, text);
  return text;
}

/** Lints `source` via `nx-dsl lint` and returns the parsed diagnostics. */
export async function lintSource(cliPath: string, source: string): Promise<NxDiagnostic[]> {
  return withTempNxFile(source, async (tempPath) => {
    const { stderr } = await run(cliPath, ['lint', tempPath]);
    const diagnostics: NxDiagnostic[] = [];
    for (const line of stderr.split('\n')) {
      const match = DIAG_LINE.exec(line);
      if (!match) continue;
      const [, lineStr, colStr, severity, code, message] = match;
      diagnostics.push({
        line: Number(lineStr),
        column: Number(colStr),
        severity: severity as 'error' | 'warning',
        code,
        message,
      });
    }
    return diagnostics;
  });
}
