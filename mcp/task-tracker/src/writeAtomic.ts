import * as fsPromises from "node:fs/promises"

export type FsDeps = Pick<typeof fsPromises, "writeFile" | "rename" | "copyFile" | "unlink">

const isENOENT = (err: unknown): boolean => (err as NodeJS.ErrnoException | null)?.code === "ENOENT"

const isEXDEV = (err: unknown): boolean => (err as NodeJS.ErrnoException | null)?.code === "EXDEV"

export async function writeAtomic(
  path: string,
  contents: string,
  fs: FsDeps = fsPromises,
): Promise<void> {
  const tmpPath = `${path}.${process.pid}.${Date.now()}.tmp`
  try {
    await fs.writeFile(tmpPath, contents, "utf8")
  } catch (err) {
    await fs.unlink(tmpPath).catch((e) => {
      if (!isENOENT(e)) throw e
    })
    throw err
  }
  try {
    await fs.rename(tmpPath, path)
  } catch (err) {
    if (!isEXDEV(err)) {
      await fs.unlink(tmpPath).catch((e) => {
        if (!isENOENT(e)) throw e
      })
      throw err
    }
    await fs.copyFile(tmpPath, path)
    await fs.unlink(tmpPath)
  }
}
