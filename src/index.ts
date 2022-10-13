import m3u8 from "@eyevinn/m3u8";
import { ReadStream } from "fs";
import { v4 as uuidv4 } from 'uuid';
import { CMCDPayload, CMCD, createInstance } from "./cmcd";
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
    this.m3u.items.StreamItem.concat(this.m3u.items.MediaItem).forEach(item => {
      const searchParams = new URLSearchParams(item.get("uri").split("?")[1]);
      if (item.get("bandwidth")) {
        this.initValues.encodedBitrate = Math.floor(item.get("bandwidth") / 1000);
      }
      const payload = createInstance(searchParams, this.initValues);
      payload.appendSearchParams(searchParams);
      this.applyCMCDPayload(payload, item);
    });
  }

  private decorateMediaPlaylist():void {
    this.m3u.items.PlaylistItem.forEach(item => {
      const searchParams = new URLSearchParams(item.get("uri").split("?")[1]);
      this.initValues.objectDuration = parseFloat(item.get("duration")) * 1000;
      const payload = createInstance(searchParams, this.initValues);
      payload.appendSearchParams(searchParams);
      this.applyCMCDPayload(payload, item);
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

