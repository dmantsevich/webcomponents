/**
 * Simple configuration object
 */
const config = {
  namespace: 'wc',
  get componentExtensionClassName() {
    return `${config.namespace}-cx`;
  },
  get componentExtension() {
    return `.${config.componentExtensionClassName}`;
  },
  get componentExtensionDestroyEvent() {
    return `${config.namespace}:cx:destroy`;
  }
};

/**
 * Get/Set config
 * @param value
 */
export default function(value) {
  value && Object.assign(config, value);
  return config;
}
