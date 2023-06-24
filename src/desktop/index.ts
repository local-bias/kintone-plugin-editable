import { controlField, getChangeEvents } from '@/common/kintone';
import Launcher from '@/common/launcher';
import { restoreStorage } from '@/common/plugin';
import { Record } from '@kintone/rest-api-client/lib/src/client/types';

class C {
  private readonly _fieldCode: string;
  private readonly _editable: boolean;

  public constructor(fieldCode: string, editable: boolean) {
    this._fieldCode = fieldCode;
    this._editable = editable;
  }

  public control(e: kintone.Event, rule: (e: kintone.Event) => boolean): kintone.Event {
    const record = e.record as Record;
    controlField(record, this._fieldCode, (field) => {
      if (rule(e)) {
        //@ts-ignore
        field.disabled = !this._editable;
      } else {
        //@ts-ignore
        field.disabled = this._editable;
      }
    });
    return e;
  }
}

((PLUGIN_ID) => {
  const storage = restoreStorage(PLUGIN_ID);

  const configs: launcher.Config[] = [];

  for (const { targetField, rules } of storage.conditions) {
    for (const rule of rules) {
      const events: launcher.EventTypes = [
        'app.record.create.show',
        'app.record.edit.show',
        'app.record.index.edit.show',
      ];

      const subtableControlButtons = [
        document.querySelector('.add-row-image-gaia'),
        document.querySelector('.subtable-row-add-gaia'),
        document.querySelector('.remove-row-image-gaia'),
        document.querySelector('.subtable-row-delete-gaia'),
      ];

      if (rule.type !== 'always') {
        events.push(...getChangeEvents([rule.field], ['create', 'edit', 'index.edit']));
      }

      const c = new C(targetField, rule.editable);

      let action: launcher.Action = (e) => {
        console.log('アクションが未登録です');
        return e;
      };

      switch (rule.type) {
        case 'always':
          action = (e) => c.control(e, (e) => true);
          break;
        case 'empty':
          action = (e) => c.control(e, (e) => !e.record[rule.field].value);
          break;
        case 'equal':
          action = (e) => c.control(e, (e) => e.record[rule.field].value === rule.value);
          break;
        case 'full':
          action = (e) => c.control(e, (e) => e.record[rule.field].value);
          break;
        case 'greater':
          action = (e) => c.control(e, (e) => e.record[rule.field].value >= rule.value);
          break;
        case 'includes':
          action = (e) =>
            c.control(
              e,
              (e) => e.record[rule.field].value && e.record[rule.field].value.includes(rule.value)
            );
          break;
        case 'less':
          action = (e) => c.control(e, (e) => e.record[rule.field].value <= rule.value);
          break;
        case 'notEqual':
          action = (e) => c.control(e, (e) => e.record[rule.field].value !== rule.value);
          break;
        case 'notIncludes':
          action = (e) => c.control(e, (e) => !e.record[rule.field].value.includes(rule.value));
          break;
      }
      configs.push({ events, action });
    }
  }

  new Launcher(PLUGIN_ID).launch(configs);
})(kintone.$PLUGIN_ID);
