---
layout: post
title: Handling File Uploads in Node Middleware
date: '2020-06-01'
author: Michael D. Callaghan
tags: 
- Careers
- Communication
- Business
layout: post
feature: https://walkingriver.com/assets/img/node-middleware-file.jpeg
thumbnail: https://walkingriver.com/assets/img/node-middleware-file.jpeg
cover_image: https://walkingriver.com/assets/img/node-middleware-file.jpeg
canonical_url: https://walkingriver.com/node-middleware-file
published: false
---

Headling paragraph Goes here

<!--more-->

Stuff about motivation

```javascript
var fs = require('fs');
var path = require('path');
var request = require('request');

module.exports = function (req, res, helpers, cb) {
  const boltSvc = helpers.config.input.backend.boltSvc;
  const endpoint = helpers.config.orchestrations['post-bolt-upload-store-entry-codes'].destinations[0].uri;
  const storeId = req.params.storeId;
  const svcPath = endpoint
    .replace('{backend.boltSvc}', '')
    .replace('{param.storeId}', storeId);

  const uploadedFile = req.files.file.name;
  const uploadedPath = path.join(req.files.file.path);

  console.log('Sending ' + uploadedPath + ' to ' + boltSvc + '/' + svcPath);

  const formData = { file: fs.createReadStream(uploadedPath) };

  const uri = boltSvc + svcPath;
  const options = {
    url: uri,
    formData: formData,
    headers: {
      'Content-Type': req.headers['content-type'],
      'Content': req.headers.content,
      'Authorization': req.headers.authorization
    }
  };

  request.post(options, requestCallback);

  function requestCallback(err, res, body) {
    if (body && body.errors) {
      cb(null, body.errors);
    } else {
      cb(body, err);
    }
  }
}
```

Code explanation

# Summary
