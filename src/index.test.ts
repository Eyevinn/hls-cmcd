import { createReadStream } from "fs";
import { DecoratedHls } from ".";

describe("Multivariant HLS", () => {
  test("has decorated media playlist urls", async () => {
    const manifest = createReadStream("./testvectors/manifest.m3u8");
    const hls = new DecoratedHls(manifest);
    const m3u = await hls.decorate();

    console.log(m3u.toString());
  });
});