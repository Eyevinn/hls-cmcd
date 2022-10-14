import m3u8 from "@eyevinn/m3u8";
import { ReadStream } from "fs";
import { Payload, createPayload, CMCDObjectTypeToken } from "@eyevinn/cmcd";

export class DecoratedHls {
  private m3u: any;
  private stream: ReadStream;
  private initValues?;

  constructor(stream: ReadStream, initValues?) {
    this.stream = stream;
    this.initValues = initValues;
  }

  private applyCMCDPayload(payload: Payload, params: URLSearchParams, item): void {
    item.set("uri", item.get("uri").split("?")[0] + "?" + params.toString() + "&" + payload.toString());
  }

  private decorateMultivariantManifest(): void {
    this.m3u.items.StreamItem.concat(this.m3u.items.MediaItem).forEach(item => {
      const searchParams = new URLSearchParams(item.get("uri").split("?")[1]);
      if (item.get("bandwidth")) {
        this.initValues.encodedBitrate = Math.floor(item.get("bandwidth") / 1000);
      }
      this.initValues.objectType = CMCDObjectTypeToken.manifest;
      const payload = createPayload(searchParams, this.initValues);
      this.applyCMCDPayload(payload, searchParams, item);
    });
  }

  private decorateMediaPlaylist():void {
    this.m3u.items.PlaylistItem.forEach(item => {
      const searchParams = new URLSearchParams(item.get("uri").split("?")[1]);
      this.initValues.objectDuration = parseFloat(item.get("duration")) * 1000;
      const payload = createPayload(searchParams, this.initValues);
      this.applyCMCDPayload(payload, searchParams, item);
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

