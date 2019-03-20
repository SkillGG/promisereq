# Promise Requests

PromiseReq is a simple set of functions that make working with XMLHttpsRequest easier for those, that know Promises!

## PromiseReq

File contains an object called `PromiseReq`(`PRq` for short) containing two main function:

### getFileFromServer

It is used to (as name suggests) get file from server.
#### Syntax
```
PromiseReq.getFileFromServer(ConfigObject)
```

#### Parameters
`ConfigObject` - object that contains:

`path` - path to file.  *[needed]*

`nocache` - flag, that adds `Pragma:No-cache` and `Cache-Control:No-Cache` Headers if true.  *[optional] (default: False)*

`customHeaders` - array of objects that contain `name` (name of header) and `value` (value of header).  *[optional] (default: null)*

#### Returns
It returns Promise, that resolves when file has been successfully opened.
When it resolves it returns string representation of whole file.
Rejects when file has been not send. Rejected is string showing `status`, `statusText` and `readyState` of XMLHttpRequest when error has occured.

#### Example
```javascript
let fileData = await PromiseReq({path:"file.txt", nocache:true, customHeaders:[{name: "Accept", value:"application/json"}]});
```
