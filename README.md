# hls-cmcd

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Slack](http://slack.streamingtech.se/badge.svg)](http://slack.streamingtech.se)

Node library to decorate HLS with some CTA-5004 CMCD query params.

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

# Support

Join our [community on Slack](http://slack.streamingtech.se) where you can post any questions regarding any of our open source projects. Eyevinn's consulting business can also offer you:

- Further development of this component
- Customization and integration of this component into your platform
- Support and maintenance agreement

Contact [sales@eyevinn.se](mailto:sales@eyevinn.se) if you are interested.

# About Eyevinn Technology

Eyevinn Technology is an independent consultant firm specialized in video and streaming. Independent in a way that we are not commercially tied to any platform or technology vendor.

At Eyevinn, every software developer consultant has a dedicated budget reserved for open source development and contribution to the open source community. This give us room for innovation, team building and personal competence development. And also gives us as a company a way to contribute back to the open source community.

Want to know more about Eyevinn and how it is to work here. Contact us at work@eyevinn.se!