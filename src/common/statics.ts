import manifest from '../../plugin/manifest.json';

export const PLUGIN_NAME = manifest.name.ja;

export const URL_HOMEPAGE = 'https://ribbit.work';
export const URL_TWITTER = 'https://twitter.com/LbRibbit';
export const URL_GITHUB = 'https://github.com/Local-Bias';

export const LOCAL_STORAGE_KEY = 'ribbit-kintone-plugin';

export const RULE_TYPES = [
  { key: 'always', label: '常に' },
  { key: 'equal', label: '=（等しい）' },
  { key: 'notEqual', label: '≠ （等しくない）' },
  { key: 'includes', label: '次のキーワードを含む' },
  { key: 'notIncludes', label: '次のキーワードを含まない' },
  { key: 'greater', label: '≧ （以上）' },
  { key: 'less', label: '≦ （以下）' },
  { key: 'empty', label: '未入力の場合' },
  { key: 'full', label: '入力がある場合' },
] as const;

export type RuleTypeKey = PickType<typeof RULE_TYPES[number], 'key'>;
export type RuleTypeLabel = PickType<typeof RULE_TYPES[number], 'label'>;

export const getRuleLabelFromKey = (key: RuleTypeKey) => {
  return RULE_TYPES.find((type) => type.key === key)!.label;
};
