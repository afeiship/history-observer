/**
 * History Observer
 *
 * 一个轻量级的 TypeScript 工具库，用于监听浏览器历史记录（history）的变化，
 * 包括 pushState、replaceState 和 hashchange 事件，并提供统一的回调接口。
 *
 * 支持配置：仅在 URL 实际发生变化时触发回调（默认开启），避免冗余通知。
 *
 * A lightweight TypeScript utility to observe browser history changes,
 * including pushState, replaceState, and hashchange events, with a unified callback API.
 *
 * Features an optional config to trigger callbacks only when the URL actually changes
 * (enabled by default) to avoid redundant notifications.
 *
 * AI: https://chat.qwen.ai/c/e00e6bc1-3ed6-4714-a8ce-e60cb638cb5a
 */

type HistoryEventType = 'pushstate' | 'replacestate' | 'hashchange';

interface HistoryChangeEvent {
  type: HistoryEventType;
  oldURL: string;
  newURL: string;
}

type HistoryChangeCallback = (event: HistoryChangeEvent) => void;

interface HistoryObserverOptions {
  /**
   * 仅当 oldURL !== newURL 时才触发回调。
   * 默认: true
   */
  onlyWhenURLChanges?: boolean;
}

class HistoryObserver {
  private callbacks: HistoryChangeCallback[] = [];
  private originalPushState: typeof history.pushState;
  private originalReplaceState: typeof history.replaceState;
  private readonly onlyWhenURLChanges: boolean;

  constructor(options: HistoryObserverOptions = {}) {
    this.onlyWhenURLChanges = options.onlyWhenURLChanges ?? true;
    this.originalPushState = history.pushState;
    this.originalReplaceState = history.replaceState;

    this.overridePushState();
    this.overrideReplaceState();
    this.listenToHashChange();
  }

  private shouldDispatch(oldURL: string, newURL: string): boolean {
    if (!this.onlyWhenURLChanges) return true;
    return oldURL !== newURL;
  }

  private dispatch(type: HistoryEventType, oldURL: string, newURL: string): void {
    if (!this.shouldDispatch(oldURL, newURL)) {
      return;
    }

    const event: HistoryChangeEvent = { type, oldURL, newURL };
    for (const callback of this.callbacks) {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in history change callback:', error);
      }
    }
  }

  private overridePushState(): void {
    const self = this;
    history.pushState = function (...args: Parameters<typeof history.pushState>) {
      const oldURL = location.href;
      self.originalPushState.apply(history, args);
      self.dispatch('pushstate', oldURL, location.href);
    };
  }

  private overrideReplaceState(): void {
    const self = this;
    history.replaceState = function (...args: Parameters<typeof history.replaceState>) {
      const oldURL = location.href;
      self.originalReplaceState.apply(history, args);
      self.dispatch('replacestate', oldURL, location.href);
    };
  }

  private listenToHashChange(): void {
    window.addEventListener('hashchange', (e: HashChangeEvent) => {
      this.dispatch('hashchange', e.oldURL, e.newURL);
    });
  }

  subscribe(callback: HistoryChangeCallback): () => void {
    this.callbacks.push(callback);
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index !== -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  restore(): void {
    history.pushState = this.originalPushState;
    history.replaceState = this.originalReplaceState;
  }
}

// 默认导出一个使用默认配置（onlyWhenURLChanges: true）的实例
const historyObserver = new HistoryObserver();

export default historyObserver;
export { HistoryObserver };
export type { HistoryChangeEvent, HistoryChangeCallback, HistoryEventType, HistoryObserverOptions };
