# getInfo

Can be called to retreive wallet app info.


## Method Interface

```
function getInfo(): Promise<GetInfoOutput>
```

## Success return value
```js
interface GetInfoOutput {
  version: string; // Version of the app
  platform: string; // iOS or Android version
  protocols: string[]; // A list of available protocols (eg BCH/BTC/SLP/ETH)
}
```


## Error return value
```js
interface Error {
  type: string; // `NO_PROVIDER`|`CONNECTION_DENIED`
  description: string;
  data: string;
}
```


## Client Call Example
```js
getInfo()
.then((data: GetInfoOutput) => {
  const {
    version,
    platform,
    protocols,
  } = data;

  console.log('App Version: ' + version);
  console.log('App Platform ' + platform);
  console.log('Available Protocols ' + protocols);
})
.catch(({type: string, description: string, data: any}) => {
  switch(type) {
    case NO_PROVIDER:
      console.log('No provider available.');
      break;
    case CANCELED:
      console.log('The user has canceled this request.');
      break;
    case PROTOCOL_ERROR:
      console.log('The provided protocol is not supported by this wallet.');
      break;
  }
});
```


## Wallet Provider Support

| Provider                | Supported | Comments |
| ----------------------- | --------- | -------- |
| Badger Chrome Extension | ⛔️         |          |
| Badger Mobile           | ⛔️         |          |
| Bitcoin.com iOS         | ✅         |          |
| Bitcoin.com Android     | ✅         |          |
