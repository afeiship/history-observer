import { HistoryObserver, HistoryChangeEvent } from '../src';

describe('HistoryObserver', () => {
  let historyObserver: HistoryObserver;
  let unsubscribe: () => void;
  let callback: jest.Mock;

  beforeEach(() => {
    historyObserver = new HistoryObserver();
    callback = jest.fn();
    unsubscribe = historyObserver.subscribe(callback);
  });

  afterEach(() => {
    unsubscribe();
    historyObserver.restore();
    // 恢复 hash
    window.location.hash = '';
  });

  test('should trigger callback on pushState when URL changes', () => {
    const oldURL = window.location.href;
    history.pushState({}, '', '/new-path');
    expect(callback).toHaveBeenCalledWith({
      type: 'pushstate',
      oldURL,
      newURL: window.location.href
    });
  });

  test('should trigger callback on replaceState when URL changes', () => {
    const oldURL = window.location.href;
    history.replaceState({}, '', '/another-path');
    expect(callback).toHaveBeenCalledWith({
      type: 'replacestate',
      oldURL,
      newURL: window.location.href
    });
  });

  test('should trigger callback on hashchange', () => {
    const oldURL = window.location.href;
    window.location.hash = '#test';
    // hashchange 事件是异步的，需要等待
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(callback).toHaveBeenCalledWith({
          type: 'hashchange',
          oldURL,
          newURL: window.location.href
        });
        resolve();
      }, 10);
    });
  });

  test('should not trigger callback if onlyWhenURLChanges is true and URL does not change', () => {
    const observer = new HistoryObserver({ onlyWhenURLChanges: true });
    const cb = jest.fn();
    const unsub = observer.subscribe(cb);
    history.pushState({}, '', window.location.href); // URL 没变
    expect(cb).not.toHaveBeenCalled();
    unsub();
    observer.restore();
  });

  test('should trigger callback even if URL does not change when onlyWhenURLChanges is false', () => {
    const observer = new HistoryObserver({ onlyWhenURLChanges: false });
    const cb = jest.fn();
    const unsub = observer.subscribe(cb);
    history.pushState({}, '', window.location.href); // URL 没变
    expect(cb).toHaveBeenCalled();
    unsub();
    observer.restore();
  });
});
