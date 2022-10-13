import m3u8 from "@eyevinn/m3u8";
import { ReadStream } from "fs";
import { v4 as uuidv4 } from 'uuid';
import { CMCDPayload, CMCD } from "./cmcd";
export { CMCDPayload };

export class DecoratedHls {
  private m3u: any;
  private stream: ReadStream;
  private initValues?: CMCD;

  constructor(stream: ReadStream, initValues?: CMCD) {
    this.stream = stream;
    this.initValues = initValues;
  }

  private applyCMCDPayload(payload: CMCDPayload, item): void {
    item.set("uri", item.get("uri").split("?")[0] + "?" + payload.params.toString());
  }

  private decorateMultivariantManifest(): void {
    const sessionID = this.initValues?.sessionID || uuidv4();

    this.m3u.items.StreamItem.concat(this.m3u.items.MediaItem).forEach(item => {
      const searchParams = new URLSearchParams(item.get("uri").split("?")[1]);
      const payload = new CMCDPayload({ sessionID });
      payload.appendSearchParams(searchParams);
      this.applyCMCDPayload(payload, item);
    });
  }

  private decorateMediaPlaylist():void {
    const sessionID = this.initValues?.sessionID || uuidv4();
    this.m3u.items.PlaylistItem
  }

  decorate(): Promise<any> {
    return new Promise((resolve, reject) => {
      const parser = m3u8.createStream();
      parser.on("m3u", m3u => {
        this.m3u = m3u;

        if (this.m3u.items.StreamItem.length > 0) {
          // Multivariant manifest
          this.decorateMultivariantManifest();
        } else {
          // Media playlist
          this.decorateMediaPlaylist();
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

