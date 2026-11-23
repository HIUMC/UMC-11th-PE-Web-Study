import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseEnv } from "node:util";

// 로컬 파일을 읽기만 한다. 비밀값을 파일이나 로그에 기록하지 않는다.
export function loadPreviousEnvironment({
  projectDirectory = process.cwd(),
  environment = process.env,
} = {}) {
  const mode = environment.NODE_ENV === "production" ? "production" : "development";
  const filenames = [
    `.env.${mode}.local`,
    ".env.local",
    `.env.${mode}`,
    ".env",
  ];
  const previousDirectories = [8, 7, 6, 5].map((week) =>
    resolve(projectDirectory, `../../week${week}/mission1`),
  );

  function readDirectory(directory) {
    const values = {};
    for (const filename of filenames) {
      try {
        const parsed = parseEnv(readFileSync(resolve(directory, filename), "utf8"));
        for (const [key, value] of Object.entries(parsed)) {
          if (!values[key] && value.trim()) values[key] = value.trim();
        }
      } catch (error) {
        if (error.code !== "ENOENT" && error.code !== "ENOTDIR") throw error;
      }
    }
    return values;
  }

  const sources = [
    environment,
    readDirectory(projectDirectory),
    ...previousDirectories.map(readDirectory),
  ];
  const mappings = [
    ["TMDB_ACCESS_TOKEN", "VITE_TMDB_ACCESS_TOKEN"],
    ["TMDB_API_BASE_URL", "VITE_TMDB_API_BASE_URL"],
    ["NEXT_PUBLIC_API_BASE_URL", "VITE_API_BASE_URL"],
  ];

  for (const [currentName, previousName] of mappings) {
    if (environment[currentName]?.trim()) continue;
    const source = sources.find((values) => values[currentName]?.trim() || values[previousName]?.trim());
    const value = source?.[currentName]?.trim() || source?.[previousName]?.trim();
    if (value) environment[currentName] = value;
  }

  environment.TMDB_API_BASE_URL ||= "https://api.themoviedb.org/3";
  environment.NEXT_PUBLIC_API_BASE_URL ||= "http://localhost:8080";
}
