import { AbstractWebcomponent } from './abstract-component';
import { triggerHandler } from './helpers/dom/events';
import getConfig from './config';

export class Webcomponent extends AbstractWebcomponent(HTMLElement) {

  constructor() {
    super();
    this._create(this);
  }

  connectedCallback() {
    // Try to override init fn instead of connectedCallback
    super.connectedCallback();

    if (!this._constructCalled) {
      this.construct();
      this._constructCalled = true;
    }

    this.init();
  }

  disconnectedCallback() {
    this._el && this.onDestroy();
    super.disconnectedCallback();
  }

  onDestroy() {
    const {componentExtension, componentExtensionDestroyEvent} = getConfig();
    // Notify CX about removing
    this.find(componentExtension).forEach((cx) => triggerHandler(cx, componentExtensionDestroyEvent));
    this.is(componentExtension) && triggerHandler(this._el, componentExtensionDestroyEvent);

    super.onDestroy();
  }
}
