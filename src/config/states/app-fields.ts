import { selector } from 'recoil';
import { OneOf } from '@kintone/rest-api-client/lib/src/KintoneFields/types/property';
import { getAllFields } from '@/common/kintone';

const state = selector<OneOf[]>({
  key: 'AppFields',
  get: async () => {
    const properties = await getAllFields();
    return properties;
  },
});

export default state;
