import { EventHooks } from './event-manager-hooks';

/**
 * Subscribe to event
 * @param component
 * @param eventDeclaration
 * @param callback
 * @returns {offWrapper}
 */
export function listenEvent(component, eventDeclaration, callback) {
  let { delegateTo, event, hookName } = eventDeclaration;

  eventDeclaration.params ?? (eventDeclaration.params = {});

  callback = callback || eventDeclaration.callback;

  typeof callback === 'string' && (callback = component[callback]);
  callback = callback.bind(component);

  const off = (hookName && EventHooks[hookName]) ? EventHooks[hookName](event, callback, component, eventDeclaration) :
    component.on(event, callback, delegateTo);

  function offWrapper() {
    try {
      off();
      component._unlistenEvents = component?._unlistenEvents.filter(({ off }) => off !== offWrapper);
    } catch (e) {
      //
    }
  }

  component?._unlistenEvents.push({ off: offWrapper, ...eventDeclaration });
  return offWrapper;
}

/**
 * Unsubscribe from event
 * @param component
 * @param eventDeclaration
 */
export function unlistenEvent(component, eventDeclaration) {
  eventDeclaration?.off();
}
