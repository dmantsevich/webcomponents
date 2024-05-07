import { onResize, onScroll, on as onWindowEvent } from '../helpers/window';
import { on as onDocumentEvent } from './../helpers/document';
//import { onChange } from '../helpers/breakpoints';
//import { onViewport, onViewportOnce, onViewportLeave, onViewportChange } from '../helpers/dom/observers';
//import { noop } from '../helpers/utility';

const EventHooks = {

  '{document}'(event, callback, component, eventDeclaration) {
    return onDocumentEvent(event, callback, eventDeclaration.delegateTo);
  },

  '{window}'(event, callback, component, eventDeclaration) {
    switch (event) {
      case 'resize':
        return onResize(callback, eventDeclaration?.params.delay);
      case 'scroll':
        return onScroll(callback, eventDeclaration?.params.delay);
      /*case 'breakpointChange':
        return onChange(callback, eventDeclaration?.params.justEvent);*/
      default:
        return onWindowEvent(event, callback);
    }
  },

  '{this}'(event, callback, component, eventDeclaration) {
/*    switch (event) {
      case 'viewportInit': {
        const params = Object.assign({ rootMargin: `250px`, threshold: 0.01 }, eventDeclaration.params);
        return onViewportOnce(component._el, callback, params);
      }
      case 'viewport':
        return onViewport(component._el, callback, eventDeclaration?.params);
      case 'viewportOnce':
        return onViewportOnce(component._el, callback, eventDeclaration?.params);
      case 'viewportLeave':
        return onViewportLeave(component._el, callback, eventDeclaration?.params);
      case 'viewportChange':
        return onViewportChange(component._el, callback, eventDeclaration?.params);
      default:
        return noop;
    }*/
  }
};

export { EventHooks };
