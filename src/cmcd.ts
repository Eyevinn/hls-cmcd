class CMCDKeyValue<T> {
  private key_: string;
  private header_: string;
  private value_: T;

  constructor(key: string, header: string, value: T) {
    this.key_ = key;
    this.header_ = header;
    this.value_ = value;
  }
  
  get key(): string { return this.key_ }
  get header(): string { return this.header_ }
  get value(): T { return this.value_ }
}

export class CMCDEncodedBitrate extends CMCDKeyValue<Number> {
  constructor(value: Number) {
    super("br", "CMCD-Object", value);
  }
}

export class CMCDBufferLength extends CMCDKeyValue<Number> {
  constructor(value: Number) {
    super("bl", "CMCD-Request", value);
  }
}

export class CMCDBufferStarvation extends CMCDKeyValue<Boolean> {
  constructor(value: Boolean) {
    super("bs", "CMCD-Status", value);
  }
}

export class CMCDContentID extends CMCDKeyValue<string> {
  constructor(value: string) {
    super("cid", "CMCD-Session", '"' + value + '"');
  }
}

export class CMCDObjectDuration extends CMCDKeyValue<Number> {
  constructor(value: Number) {
    super("d", "CMCD-Object", value);
  }
}

export class CMCDDeadline extends CMCDKeyValue<Number> {
  constructor(value: Number) {
    super("dl", "CMCD-Request", value);
  }
}

export class CMCDMeasuredThroughput extends CMCDKeyValue<Number> {
  constructor(value: Number) {
    super("mtp", "CMCD-Request", value);
  }
}

export class CMCDNextObjectRequest extends CMCDKeyValue<string> {
  constructor(value: string) {
    super("nor", "CMCD-Request", '"' + value + '"');
  }
}

export class CMCDNextRangeRequest extends CMCDKeyValue<string> {
  constructor(value: string) {
    super("nrr", "CMCD-Request", '"' + value + '"');
  }
}

export enum CMCDObjectTypeToken {
  m = "m", 
  a = "a",
  v = "v",
  av = "av",
  i = "i",
  c = "c",
  tt = "tt",
  k = "k",
  o = "o" 
}

export class CMCDObjectType extends CMCDKeyValue<CMCDObjectTypeToken> {
  constructor(value: CMCDObjectTypeToken) {
    super("ot", "CMCD-Object", value);
  }
}

export class CMCDPlaybackRate extends CMCDKeyValue<Number> {
  constructor(value: Number) {
    super("pr", "CMCD-Session", value);
  }
}

export class CMCDRequestedMaximumThroughput extends CMCDKeyValue<Number> {
  constructor(value: Number) {
    super("rtp", "CMCD-Status", value);
  }
}

export enum CMCDStreamingFormatToken {
  MPD = "d",
  HLS = "h",
  MSS = "s",
  Other = "o"
}

export class CMCDStreamingFormat extends CMCDKeyValue<CMCDStreamingFormatToken> {
  constructor(value: CMCDStreamingFormatToken) {
    super("sf", "CMCD-Session", value);
  }
}

export class CMCDSessionID extends CMCDKeyValue<string> {
  constructor(value: string) {
    super("sid", "CMCD-Session", '"' + value + '"');
  }
}

export enum CMCDStreamTypeToken {
  LIVE = "l",
  VOD = "v"
}

export class CMCDStreamType extends CMCDKeyValue<CMCDStreamTypeToken> {
  constructor(value: CMCDStreamTypeToken) {
    super("st", "CMCD-Session", value);
  }
}

export class CMCDStartup extends CMCDKeyValue<Boolean> {
  constructor(value: Boolean) {
    super("su", "CMCD-Request", value);
  }
}

export class CMCDTopBitrate extends CMCDKeyValue<Number> {
  constructor(value: Number) {
    super("tb", "CMCD-Object", value);
  }
}

export class CMCDVersion extends CMCDKeyValue<Number> {
  constructor() {
    super("v", "CMCD-Session", 1);
  }
}

export interface CMCD {
  encodedBitrate?: Number;
  bufferLength?: Number;
  bufferStarvation?: Boolean;
  contentID?: string;
  objectDuration?: Number;
  deadline?: Number;
  measuredThroughput?: Number;
  nextObjectRequest?: string;
  nextRangeRequest?: string;
  objectType?: CMCDObjectTypeToken;
  playbackRate?: Number;
  requestedMaximumThroughput?: Number;
  streamingFormat?: Number;
  sessionID?: string;
  streamType?: CMCDStreamTypeToken;
  startup?: boolean;
  topBitrate?: Number;
}

const CMCD_MAP = {
  "br": "encodedBitrate",
  "bl": "bufferLength",
  "bs": "bufferStarvation",
  "cid": "contentID",
  "d": "objectDuration",
  "dl": "deadline",
  "mtp": "measuredThroughput",
  "nor": "nextObjectRequest",
  "nrr": "nextRangeRequest",
  "ot": "objectType",
  "pr": "playbackRate",
  "rtp": "requestedMaximumThroughput",
  "sf": "streamingFormat",
  "sid": "sessionID",
  "st": "streamType",
  "su": "startup",
  "tb": "topBitrate"
};

function create<T>(ctor: { new (raw): T }, v): T {
  return v !== undefined ? new ctor(v) : undefined;
}

export function createInstance(searchParams: URLSearchParams, override?: CMCD) {
  let v = [];
  if (searchParams.getAll("CMCD")[0]) {
    v = searchParams.getAll("CMCD")[0].split(",");
  }
  let cmcd: CMCD = {};

  if (override) {
    cmcd = override;
  }
  v.forEach(kv => {
    const [k, v] = kv.split("=");
    if (cmcd[CMCD_MAP[k]]) {
      // do not overwrite overrides
      return;
    }
    if (v) {
      if (v[0] === '"' && v[v.length - 1] === '"') {
        cmcd[CMCD_MAP[k]] = v.substring(1, v.length - 1);
      } else if (v.match(/^[0-9\.]*$/)) {
        cmcd[CMCD_MAP[k]] = Number(v);
      } else {
        cmcd[CMCD_MAP[k]] = v;
      }
    } else {
      cmcd[CMCD_MAP[k]] = true;
    }
  });
  return new CMCDPayload(cmcd);
}

export class CMCDPayload {
  private _encodedBitrate?: CMCDEncodedBitrate;
  private _bufferLength?: CMCDBufferLength;
  private _bufferStarvation?: CMCDBufferStarvation;
  private _contentID?: CMCDContentID;
  private _objectDuration?: CMCDObjectDuration;
  private _deadline?: CMCDDeadline;
  private _measuredThroughput?: CMCDMeasuredThroughput;
  private _nextObjectRequest?: CMCDNextObjectRequest;
  private _nextRangeRequest?: CMCDNextRangeRequest;
  private _objectType?: CMCDObjectType;
  private _playbackRate?: CMCDPlaybackRate;
  private _requestedMaximumThroughput?: CMCDRequestedMaximumThroughput;
  private _streamingFormat?: CMCDStreamingFormat;
  private _sessionID?: CMCDSessionID;
  private _streamType?: CMCDStreamType;
  private _startup?: CMCDStartup;
  private _topBitrate?: CMCDTopBitrate;
  private _version?: CMCDVersion;
  private _params: URLSearchParams;

  constructor(v: CMCD) {
    this._encodedBitrate = create(CMCDEncodedBitrate, v.encodedBitrate);
    this._bufferLength = create(CMCDBufferLength, v.bufferLength);
    this._bufferStarvation = create(CMCDBufferStarvation, v.bufferStarvation);
    this._contentID = create(CMCDContentID, v.contentID);
    this._objectDuration = create(CMCDObjectDuration, v.objectDuration);
    this._deadline = create(CMCDDeadline, v.deadline);
    this._measuredThroughput = create(CMCDMeasuredThroughput, v.measuredThroughput);
    this._nextObjectRequest = create(CMCDNextObjectRequest, v.nextObjectRequest);
    this._nextRangeRequest = create(CMCDNextRangeRequest, v.nextRangeRequest);
    this._objectType = create(CMCDObjectType, v.objectType);
    this._playbackRate = create(CMCDPlaybackRate, v.playbackRate);
    this._requestedMaximumThroughput = create(CMCDRequestedMaximumThroughput, v.requestedMaximumThroughput);
    this._streamingFormat = create(CMCDStreamingFormat, v.streamingFormat);
    this._sessionID = create(CMCDSessionID, v.sessionID);
    this._streamType = create(CMCDStreamType, v.streamType);
    this._startup = create(CMCDStartup, v.startup);
    this._topBitrate = create(CMCDTopBitrate, v.topBitrate);
  }

  appendSearchParams(searchParams: URLSearchParams) {
    searchParams.forEach((value, key) => {
      this.params.set(key, value);
    });
  }

  get(key: string) {
    const k = '_' + key;
    if (this[k]) {
      return this[k].value;
    }
  }

  get params() {
    let keys = [ 
      "encodedBitrate", "bufferLength", "bufferStarvation", 
      "contentID", "objectDuration", "deadline", "measuredThroughput",
      "nextObjectRequest", "nextRangeRequest", "objectType", "playbackRate",
      "requestedMaximumThroughput", "streamingFormat", "sessionID",
      "streamType", "startup", "topBitrate", "version"
    ];
    const kv = keys
      .map(k => {
        const key = '_' + k;
        if (this[key]) {
          if (this[key].value === true) {
            return this[key].key;
          } else if (this[key].value === false) {
            return undefined;
          } else {
            return this[key].key + "=" + this[key].value;
          }
        }
        return undefined;
      })
      .filter(n => n)
    if (!this._params) {
      let v = {};
      if (kv.length > 0) {
        v = { CMCD: kv.join(",") }
      }
      this._params = new URLSearchParams(v);
    }
    return this._params;
  }
}
  