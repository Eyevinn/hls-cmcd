import { createReadStream } from "fs";
import { DecoratedHls } from ".";

describe("HLS Multivariant manifest", () => {
  test("has decorated media playlist urls", async () => {
    const manifest = createReadStream("./testvectors/manifest.m3u8");
    const hls = new DecoratedHls(manifest, { sessionID: "7d623fe5-20cb-45fc-9d0b-57e9fce17611" });
    const m3u = await hls.decorate();
    const arr = m3u.toString().split("\n");
    console.log(arr);
    expect(arr[4]).toEqual("manifest_1.m3u8?CMCD=sid%3D%227d623fe5-20cb-45fc-9d0b-57e9fce17611%22&type=asdf");
    expect(arr[18]).toEqual('#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="audio",LANGUAGE="en",NAME="English stereo",CHANNELS="2",DEFAULT=NO,AUTOSELECT=YES,URI="manifest_audio_en.m3u8?CMCD=sid%3D%227d623fe5-20cb-45fc-9d0b-57e9fce17611%22&type=asdf"');
  });
});

describe("HLS Media playlist", () => {
  test("has decorated media segment urls", async () => {
    const manifest = createReadStream("./testvectors/manifest_1.m3u8");
    const hls = new DecoratedHls(manifest, { sessionID: "7d623fe5-20cb-45fc-9d0b-57e9fce17611" });
    const m3u = await hls.decorate();
    const arr = m3u.toString().split("\n");
    console.log(arr);
    expect(arr[6]).toEqual("manifest_1_00001.ts?CMCD=d%3D10000%2Csid%3D%227d623fe5-20cb-45fc-9d0b-57e9fce17611%22&type=asdf");
  });
});