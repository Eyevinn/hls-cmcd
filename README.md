# hls-cmcd

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Slack](http://slack.streamingtech.se/badge.svg)](http://slack.streamingtech.se)

Node library to decorate HLS with CTA-5004 CMCD query params.

```javascript
const { DecoratedHls } = require("@eyevinn/hls-cmcd");

const response = await fetch(url);
if (response.ok) {
    const hls = new DecoratedHls(response.body);
    const m3u = await hls.decorate();
    console.log(m3u.toString());
}
```