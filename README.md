# hls-cmcd

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Slack](http://slack.streamingtech.se/badge.svg)](http://slack.streamingtech.se)

Node library to decorate HLS with CTA-5004 CMCD query params.

Example of use case is to use this library in a proxy that decorates an HLS with CMCD query parameters, in those cases where that is preferred (credit to Anders Näsman/Akamai for the idea).

Adds the following tags when information is available:

- `br` (Encoded Bitrate): based on bandwidth declaration in multivariant manifest. Added to the media playlist URL in the multivariant manifest.
- `d` (Object Duration): based on segment duration declared in media playlist. Added to the segment URLs in a media playlist.
- `nor` (Next Object Request): TBD
- `ot` (Object Type): Added as `m` to the media playlist URL in the multivariant manifest.

## Example

```javascript
const { DecoratedHls } = require("@eyevinn/hls-cmcd");

const response = await fetch(url);
if (response.ok) {
    const hls = new DecoratedHls(response.body);
    const m3u = await hls.decorate();
    console.log(m3u.toString());
}
```
