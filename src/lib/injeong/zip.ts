import { crc32 } from "node:zlib";

/**
 * A ZIP written as a stream, files stored without compression (the photos are JPGs already).
 * Each file is in memory only while it is being written, so a backup with many photos stays small in RAM.
 */
export type ZipEntry = { name: string; data: Uint8Array };

const u16 = (n: number) => { const b = Buffer.alloc(2); b.writeUInt16LE(n); return b; };
const u32 = (n: number) => { const b = Buffer.alloc(4); b.writeUInt32LE(n >>> 0); return b; };

export function zipStream(entries: AsyncIterable<ZipEntry>): ReadableStream<Uint8Array> {
  const central: Buffer[] = [];
  let offset = 0;
  let count = 0;
  const it = entries[Symbol.asyncIterator]();
  // every entry carries the same DOS date, 2026-01-01
  const time = u16(0);
  const date = u16(((2026 - 1980) << 9) | (1 << 5) | 1);
  return new ReadableStream<Uint8Array>({
    async pull(ctrl) {
      const next = await it.next();
      if (next.done) {
        const dir = Buffer.concat(central);
        ctrl.enqueue(Buffer.concat([dir, u32(0x06054b50), u16(0), u16(0), u16(count), u16(count), u32(dir.length), u32(offset), u16(0)]));
        ctrl.close();
        return;
      }
      const name = Buffer.from(next.value.name, "utf8");
      const data = next.value.data;
      // version 2.0, flag 0x0800 (UTF-8 name), method 0 (stored)
      const head = [u16(20), u16(0x0800), u16(0), time, date, u32(crc32(data)), u32(data.length), u32(data.length), u16(name.length), u16(0)];
      const local = Buffer.concat([u32(0x04034b50), ...head, name]);
      central.push(Buffer.concat([u32(0x02014b50), u16(20), ...head, u16(0), u16(0), u16(0), u32(0), u32(offset), name]));
      offset += local.length + data.length;
      count++;
      ctrl.enqueue(local);
      ctrl.enqueue(data);
    },
  });
}
