import { WebComponent } from '../../webcomponent';
import { listen } from '../../../decorators';
import { WCIOService } from './service';

export class WCIO extends WebComponent {

  static is = WebComponent.tagName('io');

  /**
   * Get target element
   * @returns {Element}
   */
  get target() {
    try {
      const target = this.attr('target') || '::parent';
      switch (target) {
        case '::parent':
          return this._el.parentElement;
        case '::prev':
          return this._el.previousElementSibling;
        case '::next':
          return this._el.nextElementSibling;
        default:
          return document.querySelector(target);
      }
    } catch (e) {
      return null;
    }
  }

  /**
   * Get key
   */
  get key() {
    return this.attr('key') || this.target?.tagName?.toLowerCase() || null;
  }

  @listen('{document} DOMContentLoaded')
  watch() {
    const { target, key } = this;
    if (!target || !key) {
      this.kill();
      return ;
    }
    WCIOService.watch(target, key).then(() => this.kill());
  }

  /**
   * Kill watcher
   */
  kill() {
    this.remove();
  }
}
