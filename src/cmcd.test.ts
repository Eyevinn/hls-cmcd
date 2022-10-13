import * as CMCD from "./cmcd";

describe("CMCD Types", () => {
  test("have the correct keys", () => {
    expect(new CMCD.CMCDEncodedBitrate(0).key).toEqual("br");
    expect(new CMCD.CMCDBufferLength(0).key).toEqual("bl");
    expect(new CMCD.CMCDBufferStarvation(true).key).toEqual("bs");
    expect(new CMCD.CMCDContentID("foo").key).toEqual("cid");
    expect(new CMCD.CMCDObjectDuration(0).key).toEqual("d");
    expect(new CMCD.CMCDDeadline(0).key).toEqual("dl");
    expect(new CMCD.CMCDMeasuredThroughput(0).key).toEqual("mtp");
    expect(new CMCD.CMCDNextObjectRequest("bar").key).toEqual("nor");
    expect(new CMCD.CMCDNextRangeRequest("a-b").key).toEqual("nrr");
    expect(new CMCD.CMCDObjectType(CMCD.CMCDObjectTypeToken.a).key).toEqual("ot");
    expect(new CMCD.CMCDPlaybackRate(0.5).key).toEqual("pr");
    expect(new CMCD.CMCDRequestedMaximumThroughput(0).key).toEqual("rtp");
    expect(new CMCD.CMCDStreamingFormat(CMCD.CMCDStreamingFormatToken.HLS).key).toEqual("sf");
    expect(new CMCD.CMCDSessionID("foobar").key).toEqual("sid");
    expect(new CMCD.CMCDStreamType(CMCD.CMCDStreamTypeToken.LIVE).key).toEqual("st");
    expect(new CMCD.CMCDStartup(false).key).toEqual("su");
    expect(new CMCD.CMCDTopBitrate(0).key).toEqual("tb");
    expect(new CMCD.CMCDVersion().key).toEqual("v");
  });

  test("have the correct headers", () => {
    expect(new CMCD.CMCDEncodedBitrate(0).header).toEqual("CMCD-Object");
    expect(new CMCD.CMCDBufferLength(0).header).toEqual("CMCD-Request");
    expect(new CMCD.CMCDBufferStarvation(true).header).toEqual("CMCD-Status");
    expect(new CMCD.CMCDContentID("foo").header).toEqual("CMCD-Session");
    expect(new CMCD.CMCDObjectDuration(0).header).toEqual("CMCD-Object");
    expect(new CMCD.CMCDDeadline(0).header).toEqual("CMCD-Request");
    expect(new CMCD.CMCDMeasuredThroughput(0).header).toEqual("CMCD-Request");
    expect(new CMCD.CMCDNextObjectRequest("bar").header).toEqual("CMCD-Request");
    expect(new CMCD.CMCDNextRangeRequest("a-b").header).toEqual("CMCD-Request");
    expect(new CMCD.CMCDObjectType(CMCD.CMCDObjectTypeToken.a).header).toEqual("CMCD-Object");
    expect(new CMCD.CMCDPlaybackRate(0.5).header).toEqual("CMCD-Session");
    expect(new CMCD.CMCDRequestedMaximumThroughput(0).header).toEqual("CMCD-Status");
    expect(new CMCD.CMCDStreamingFormat(CMCD.CMCDStreamingFormatToken.HLS).header).toEqual("CMCD-Session");
    expect(new CMCD.CMCDSessionID("foobar").header).toEqual("CMCD-Session");
    expect(new CMCD.CMCDStreamType(CMCD.CMCDStreamTypeToken.LIVE).header).toEqual("CMCD-Session");
    expect(new CMCD.CMCDStartup(false).header).toEqual("CMCD-Request");
    expect(new CMCD.CMCDTopBitrate(0).header).toEqual("CMCD-Object");
    expect(new CMCD.CMCDVersion().header).toEqual("CMCD-Session");
  });
});

describe("CMCD Payload", () => {
  test("as query parameters", () => {
    let payload = new CMCD.CMCDPayload({
      sessionID: "6e2fb550-c457-11e9-bb97-0800200c9a66"
    });

    expect(payload.params.toString()).toEqual("CMCD=sid%3D%226e2fb550-c457-11e9-bb97-0800200c9a66%22");
    let v = new URLSearchParams(payload.params.toString()).getAll("CMCD")[0].split(",");
    expect(v.find(k => k.match(/^bs/))).toBeUndefined();

    payload = new CMCD.CMCDPayload({
      measuredThroughput: 25400,
      encodedBitrate: 3200,
      objectDuration: 4004,
      objectType: CMCD.CMCDObjectTypeToken.v,
      topBitrate: 6000,
      bufferStarvation: true,
      requestedMaximumThroughput: 15000,
    });
    v = new URLSearchParams(payload.params.toString()).getAll("CMCD")[0].split(",");
    expect(v.find(k => k.match(/^bs/))).toBeDefined();
    expect(v.find(k => k.match(/^bs/))).toEqual("bs");
  });

  test("is created from searchparam object", () => {
    let searchParams = new URLSearchParams("CMCD=br%3D3200%2Cbs%2Cd%3D4004%2Cmtp%3D25400%2Cot%3Dv%2Crtp%3D15000%2Csid%3D%226e2fb550-c457-11e9-bb97-0800200c9a66%22%2Ctb%3D6000");
    const payload = CMCD.createInstance(searchParams);
    expect(payload.get("sessionID")).toEqual('"6e2fb550-c457-11e9-bb97-0800200c9a66"');
    expect(payload.get("bufferStarvation")).toEqual(true);
    expect(payload.get("encodedBitrate")).toEqual(3200);
    expect(payload.get("objectDuration")).toEqual(4004);
    expect(payload.get("measuredThroughput")).toEqual(25400);
    expect(payload.get("objectType")).toEqual(CMCD.CMCDObjectTypeToken.v);
    expect(payload.get("requestedMaximumThroughput")).toEqual(15000);
    expect(payload.get("topBitrate")).toEqual(6000);
  });

  test("is created from searchparam object with override", () => {
    let searchParams = new URLSearchParams("CMCD=br%3D3200%2Cbs%2Cd%3D4004%2Cmtp%3D25400%2Cot%3Dv%2Crtp%3D15000%2Csid%3D%226e2fb550-c457-11e9-bb97-0800200c9a66%22%2Ctb%3D6000");
    const sessionID = "foobar";
    const payload = CMCD.createInstance(searchParams, { sessionID });
    expect(payload.get("sessionID")).toEqual('"foobar"');
    expect(payload.get("bufferStarvation")).toEqual(true);
    expect(payload.get("encodedBitrate")).toEqual(3200);
    expect(payload.get("objectDuration")).toEqual(4004);
    expect(payload.get("measuredThroughput")).toEqual(25400);
    expect(payload.get("objectType")).toEqual(CMCD.CMCDObjectTypeToken.v);
    expect(payload.get("requestedMaximumThroughput")).toEqual(15000);
    expect(payload.get("topBitrate")).toEqual(6000);
  });

  test("is created from a searchparam object with no CMCD param", () => {
    let searchParams = new URLSearchParams("foo=bar");
    const sessionID = "hejhopp";
    const payload = CMCD.createInstance(searchParams, { sessionID });
    expect(payload.get("sessionID")).toEqual('"hejhopp"');
  });
});