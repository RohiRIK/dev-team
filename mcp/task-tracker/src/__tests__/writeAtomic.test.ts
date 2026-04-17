import { afterEach, beforeEach, describe, expect, test } from "bun:test"
import * as fsPromises from "node:fs/promises"
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { type FsDeps, writeAtomic } from "../writeAtomic.ts"

let dir: string
const target = () => join(dir, "tasks.json")

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), "task-tracker-"))
})

afterEach(async () => {
  await rm(dir, { recursive: true, force: true })
})

describe("writeAtomic", () => {
  test("writes new file and reads back identical content", async () => {
    const payload = JSON.stringify({ version: 1, tasks: [] })
    await writeAtomic(target(), payload)
    expect(await readFile(target(), "utf8")).toBe(payload)
  })

  test("overwrites an existing file", async () => {
    await writeFile(target(), "stale")
    await writeAtomic(target(), "fresh")
    expect(await readFile(target(), "utf8")).toBe("fresh")
  })

  test("leaves no .tmp sibling after success", async () => {
    await writeAtomic(target(), "hello")
    const entries = await readdir(dir)
    expect(entries).toContain("tasks.json")
    expect(entries.filter((e) => e.includes(".tmp"))).toHaveLength(0)
  })

  test("handles large payloads (>64KB)", async () => {
    const payload = "x".repeat(100_000)
    await writeAtomic(target(), payload)
    expect((await readFile(target(), "utf8")).length).toBe(100_000)
  })

  test("falls back to copy+unlink when rename throws EXDEV (gdrive scenario)", async () => {
    let renameCalled = false
    const fs: FsDeps = {
      writeFile: fsPromises.writeFile,
      rename: async (_from, _to) => {
        renameCalled = true
        const err = new Error("EXDEV cross-device link") as NodeJS.ErrnoException
        err.code = "EXDEV"
        throw err
      },
      copyFile: fsPromises.copyFile,
      unlink: fsPromises.unlink,
    }
    await writeAtomic(target(), "cross-device", fs)
    expect(renameCalled).toBe(true)
    expect(await readFile(target(), "utf8")).toBe("cross-device")
    const entries = await readdir(dir)
    expect(entries.filter((e) => e.includes(".tmp"))).toHaveLength(0)
  })

  test("cleans up .tmp when write fails before rename", async () => {
    const fs: FsDeps = {
      writeFile: async () => {
        throw new Error("disk full")
      },
      rename: fsPromises.rename,
      copyFile: fsPromises.copyFile,
      unlink: fsPromises.unlink,
    }
    await expect(writeAtomic(target(), "doomed", fs)).rejects.toThrow("disk full")
    const entries = await readdir(dir)
    expect(entries.filter((e) => e.includes(".tmp"))).toHaveLength(0)
  })
})
