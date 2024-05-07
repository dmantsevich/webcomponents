import { EventHooks } from '../lifecycle/event-manager-hooks';

export function listen(event, delegateTo, params, hookName) {
  if (delegateTo && typeof delegateTo !== 'string') {
    params = delegateTo;
    delegateTo = null;
  }

  // Event format: "{document} ready" or "{window} resize"
  const parsedEvent = event.match(/^(\{.*\})\s*(.*)/);
  if (parsedEvent && parsedEvent[1] in EventHooks) {
    hookName = parsedEvent[1];
    event = parsedEvent[2];
  }

  return (Component, method) => {
    Component._listenEvents = Component._listenEvents || [];
    Component._listenEvents.push({ delegateTo, callback: method, event, params, hookName });
  };
}
