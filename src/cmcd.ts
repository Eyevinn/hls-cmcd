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

  set encodedBitrate(v: Number) { this._encodedBitrate = new CMCDEncodedBitrate(v) }

  set sessionID(v: string) { this._sessionID = new CMCDSessionID(v) }

  get params() {
    let keys = [ 
      "encodedBitrate", "bufferLength", "bufferStarvation", 
      "contentID", "objectDuration", "deadline", "measuredThroughput",
      "nextObjectRequest", "nextRangeRequest", "objectType", "playbackRate",
      "requestedMaximumThroughput", "streamingFormat", "sessionID",
      "streamType", "startup", "topBitrate", "version"
    ];
    const kv = keys.map(k => this['_'+k] ? this['_'+k].key + "=" + this['_'+k].value : undefined).filter(n => n);
    if (!this._params) {
      this._params = new URLSearchParams({ CMCD: kv.join(",") });
    }
    return this._params;
  }
}
  