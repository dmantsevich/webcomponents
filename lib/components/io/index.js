import { WebComponent } from '../../webcomponent';
import { parent } from '../../../decorators';

export class WCIO extends WebComponent {

  static is = WebComponent.tagName('io');

  @parent()
  target;

  init() {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          console.log(entry);
        }
      });
    });
    io.observe(this.target);
  }
}
