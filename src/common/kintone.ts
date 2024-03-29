import {
  Layout,
  Properties,
  Record as KintoneRecord,
} from '@kintone/rest-api-client/lib/src/client/types';
import { KintoneRestAPIClient } from '@kintone/rest-api-client';
import { Cybozu } from '../types/cybozu';
import { OneOf as FieldProperty } from '@kintone/rest-api-client/lib/src/KintoneFields/types/property';
import { OneOf as Field } from '@kintone/rest-api-client/lib/src/KintoneFields/types/field';

/** kintoneアプリに初期状態で存在するフィールドタイプ */
const DEFAULT_DEFINED_FIELDS: PickType<FieldProperty, 'type'>[] = [
  'UPDATED_TIME',
  'CREATOR',
  'CREATED_TIME',
  'CATEGORY',
  'MODIFIER',
  'STATUS',
];

declare const cybozu: Cybozu;

/**
 * 実行されている環境がモバイル端末である場合はTrueを返却します
 */
export const isMobile = (eventType?: string): boolean => {
  if (eventType) {
    return eventType.includes('mobile.');
  }
  return cybozu?.data?.IS_MOBILE_DEVICE ?? !kintone.app.getId();
};

export const getApp = (eventType?: string): typeof kintone.mobile.app | typeof kintone.app =>
  isMobile(eventType) ? kintone.mobile.app : kintone.app;

export const getAppId = (): number | null => getApp().getId();
export const getRecordId = (): number | null => getApp().record.getId();

export const getSpaceElement = (spaceId: string): HTMLElement | null =>
  getApp().record.getSpaceElement(spaceId);

/**
 * 現在の検索条件を返却します
 * @returns 検索条件
 */
export const getQuery = (): string | null => getApp().getQuery();

/**
 * 現在の検索条件のうち、絞り込み情報の部分のみを返却します
 * @returns 検索条件の絞り込み情報
 */
export const getQueryCondition = (): string | null => getApp().getQueryCondition();

/**
 * 現在表示しているレコード情報を返却します
 * - デバイス毎に最適な情報を返します
 * @returns レコード情報
 */
export const getCurrentRecord = (): KintoneRecord => getApp().record.get();

/**
 * 現在表示しているレコード情報へデータを反映します
 * @param record レコード情報
 */
export const setCurrentRecord = (record: KintoneRecord): void => getApp().record.set(record);

export const setFieldShown = (code: string, visible: boolean): void =>
  getApp().record.setFieldShown(String(code), visible);

/**
 * ヘッダー部分のHTML要素を返却します
 * - デバイス毎に最適な情報を返します
 * - レコード一覧以外で実行した場合はnullが返ります
 * @returns ヘッダー部分のHTML要素
 */
export const getHeaderSpace = (eventType: string): HTMLElement | null => {
  if (isMobile(eventType)) {
    kintone.mobile.app.getHeaderSpaceElement();
  } else if (!~eventType.indexOf('index')) {
    return kintone.app.record.getHeaderMenuSpaceElement();
  }
  return kintone.app.getHeaderMenuSpaceElement();
};

export const getAppFields = async (targetApp?: string | number): Promise<Properties> => {
  const app = targetApp || kintone.app.getId();

  if (!app) {
    throw new Error('アプリのフィールド情報が取得できませんでした');
  }

  const client = new KintoneRestAPIClient();

  const { properties } = await client.app.getFormFields({ app });

  return properties;
};

export const getUserDefinedFields = async (): Promise<Properties> => {
  const fields = await getAppFields();

  const filterd = Object.entries(fields).filter(
    ([_, value]) => !DEFAULT_DEFINED_FIELDS.includes(value.type)
  );

  return filterd.reduce<Properties>((acc, [key, value]) => ({ ...acc, [key]: value }), {});
};

export const getAppLayout = async (): Promise<Layout> => {
  const app = getAppId();

  if (!app) {
    throw new Error('アプリのフィールド情報が取得できませんでした');
  }

  const client = new KintoneRestAPIClient();

  const { layout } = await client.app.getFormLayout({ app });

  return layout;
};

/** サブテーブルをばらしてフィールドを返却します */
export const getAllFields = async (): Promise<FieldProperty[]> => {
  const properties = await getAppFields();

  const fields = Object.values(properties).reduce<FieldProperty[]>((acc, property) => {
    if (property.type === 'SUBTABLE') {
      return [...acc, ...Object.values(property.fields)];
    }
    return [...acc, property];
  }, []);

  return fields;
};

export const getChangeEvents = (
  fields: string[],
  events: ('create' | 'edit' | 'index.edit')[]
): kintone.EventType[] => {
  const changeEvents = events.reduce<kintone.EventType[]>(
    (accu, event) =>
      [
        ...accu,
        ...fields.map((field) => `app.record.${event}.change.${field}`),
      ] as kintone.EventType[],
    []
  );
  return changeEvents;
};

/** 指定のフィールドコードのフィールドを操作します */
export const controlField = (
  record: KintoneRecord,
  fieldCode: string,
  callback: (field: Field) => void
): void => {
  if (record[fieldCode]) {
    callback(record[fieldCode]);
    return;
  }

  for (const field of Object.values(record)) {
    if (field.type === 'SUBTABLE') {
      for (const { value } of field.value) {
        if (value[fieldCode]) {
          callback(value[fieldCode]);
        }
      }
    }
  }
};
