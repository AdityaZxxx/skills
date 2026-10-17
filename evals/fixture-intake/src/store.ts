import { readFileSync, writeFileSync } from "node:fs";
import { Database } from "./types";

export function loadDatabase(path = "data.json"): Database {
  return JSON.parse(readFileSync(path, "utf8")) as Database;
}

export function saveDatabase(db: Database, path = "data.json"): void {
  writeFileSync(path, JSON.stringify(db, null, 2));
}
