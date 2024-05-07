/**
 * Define a custom element
 * @param tagName
 * @param Component
 * @param options
 */
export function register(tagName, Component, options) {
  tagName && Component && customElements.define(tagName, Component, options);
}
