# history-observer
> Observe and react to browser history changes.

[![version][version-image]][version-url]
[![license][license-image]][license-url]
[![size][size-image]][size-url]
[![download][download-image]][download-url]

## installation
```shell
yarn add @jswork/history-observer
```

## usage
```js
import historyObserver from '@jswork/history-observer';

// 监听所有实际发生的 URL 变化（默认行为：仅当 oldURL !== newURL 时触发）
const unsubscribe = historyObserver.subscribe(({ type, oldURL, newURL }) => {
  console.log(`Navigation type: ${type}`);
  console.log(`From: ${oldURL}`);
  console.log(`To:   ${newURL}`);
});

// 示例：触发 pushState（会触发回调）
history.pushState(null, '', '/page1');

// 示例：重复设置相同 URL（不会触发回调，因 URL 未变）
history.pushState(null, '', '/page1');

// 手动取消监听
// unsubscribe();
```

## license
Code released under [the MIT license](https://github.com/afeiship/@jswork/history-observer/blob/master/LICENSE.txt).

[version-image]: https://img.shields.io/npm/v/@jswork/history-observer
[version-url]: https://npmjs.org/package/@jswork/history-observer

[license-image]: https://img.shields.io/npm/l/@jswork/history-observer
[license-url]: https://github.com/afeiship/@jswork/history-observer/blob/master/LICENSE.txt

[size-image]: https://img.shields.io/bundlephobia/minzip/@jswork/history-observer
[size-url]: https://github.com/afeiship/@jswork/history-observer/blob/master/dist/@jswork/history-observer.min.js

[download-image]: https://img.shields.io/npm/dm/@jswork/history-observer
[download-url]: https://www.npmjs.com/package/@jswork/history-observer
