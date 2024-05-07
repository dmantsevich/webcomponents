import { AbstractWebComponent } from './abstract-webcomponent';
import getConfig from './config';

export class WebComponentExtension extends AbstractWebComponent() {

  /**
   * Namespace for component extension
   * @returns {string}
   */
  static is = getConfig().componentExtensionClassName;

  constructor(el, options) {
    super();
    this._create(el);
    this.connectedCallback(options);
  }

  connectedCallback(options) {
    const {componentExtensionClassName, componentExtensionDestroyEvent} = getConfig();
    const is = this.constructor.is;
    if (is && is !== componentExtensionClassName) {
      this._el[is] = this;
    }

    this?._listenEvents.push({
      event: componentExtensionDestroyEvent,
      callback: 'disconnectedCallback'
    });

    this.connected = true;

    if (!this._constructCalled) {
      this.construct();
      this._constructCalled = true;
    }

    this.init(options);
  }

  disconnectedCallback() {
    this._el && this.onDestroy();
    const is = this.constructor.is;
    const {componentExtensionClassName} = getConfig();
    if (is && is !== componentExtensionClassName) {
      delete this._el[is];
    }
    delete this.connected;
  }

  init(options = {}) {
    const {componentExtensionClassName} = getConfig();
    const handleClassName = (clasName) => {
      if (this.hasClass(clasName)) return;
      this.addClass(clasName);
      this._onDestroyCallbacks.push(() => this.removeClass(clasName));
    }
    handleClassName(componentExtensionClassName);
    handleClassName(this.constructor.is);
    super.init();
  }

  // opposite for init()
  onDestroy() {
    super.onDestroy();
  }
}
