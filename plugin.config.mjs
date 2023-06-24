const hp = 'https://konomi.app/';
const commonCdn = 'https://cdn.jsdelivr.net/gh/local-bias/kintone-cdn@latest';
const cdn = 'https://cdn.jsdelivr.net/gh/local-bias/kintone-plugin-editable@latest';
const localhost = 'https://127.0.0.1:5500';

/** @type {import('./src/types/plugin-config').PluginConfig} */
export default {
  manifest: {
    base: {
      manifest_version: 1,
      version: '1.0.0',
      type: 'APP',
      name: {
        en: 'Field Dynamic Input Control Plugin',
        ja: 'フィールド動的入力制御プラグイン',
        zh: '插件模板',
      },
      description: {
        en: 'Depending on the state of a field, it controls the ability to input other fields.',
        ja: 'フィールドの状態に応じて、他のフィールドの入力可否を制御します。',
        zh: '插件模板',
      },
      icon: 'icon.png',
      homepage_url: { ja: hp, en: hp },
      desktop: {
        js: [`${commonCdn}/dist/desktop.js`],
        css: [],
      },
      mobile: {
        js: [`${commonCdn}/dist/desktop.js`],
        css: [],
      },
      config: {
        html: 'config.html',
        js: [`${commonCdn}/dist/config.js`],
        css: [],
        required_params: [],
      },
    },
    dev: {
      desktop: { js: [`${localhost}/dist/dev/desktop/index.js`] },
      mobile: { js: [`${localhost}/dist/dev/desktop/index.js`] },
      config: { js: [`${localhost}/dist/dev/config/index.js`] },
    },
    prod: {
      desktop: { js: [`${cdn}/cdn/desktop.js`] },
      mobile: { js: [`${cdn}/cdn/desktop.js`] },
      config: { js: [`${cdn}/cdn/config.js`] },
    },
    standalone: {
      desktop: { js: ['desktop.js'] },
      mobile: { js: ['desktop.js'] },
      config: { js: ['config.js'] },
    },
  },
};
