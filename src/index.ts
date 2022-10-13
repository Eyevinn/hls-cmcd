import m3u8 from "@eyevinn/m3u8";
import { ReadStream } from "fs";
import { CMCDPayload } from "./cmcd";
export { CMCDPayload };

export class DecoratedHls {
  private m3u: any;
  private stream: ReadStream;

  constructor(stream: ReadStream, cmcdPayload?: CMCDPayload) {
    this.stream = stream;
  }

  private decorateMultivariantManifest() {
    const sessionID = "sdfsdfsdf";

    this.m3u.items.StreamItem.map(item => {
      const searchParams = new URLSearchParams(item.get("uri").split("?")[1]);
      const payload = new CMCDPayload({ sessionID });
      searchParams.forEach((value, key) => {
        payload.params.set(key, value);
      });
      item.set("uri", item.get("uri").split("?")[0] + "?" + payload.params.toString());
    });
  }

  decorate(): Promise<any> {
    return new Promise((resolve, reject) => {
      const parser = m3u8.createStream();
      parser.on("m3u", m3u => {
        this.m3u = m3u;

        if (this.m3u.items.StreamItem.length > 0) {
          // Multivariant manifest
          this.decorateMultivariantManifest();
        }
        resolve(this.m3u);
      });
      parser.on("error", err => {
        reject({ message: `Failed to parse manifest: ${err}` });
      });

      this.stream.pipe(parser);
    });
  }
}

