import React, { VFC } from 'react';
import { useSetRecoilState } from 'recoil';
import { produce } from 'immer';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { getNewCondition } from '@/common/plugin';

import { storageState } from '../../states/plugin';

type Props = Readonly<{ addCondition: () => void }>;

const Component: VFC<Props> = ({ addCondition }) => (
  <Button
    variant='outlined'
    color='primary'
    size='small'
    startIcon={<AddIcon />}
    onClick={addCondition}
    style={{ marginTop: '16px' }}
  >
    新しい設定
  </Button>
);

const Container: VFC = () => {
  const setStorage = useSetRecoilState(storageState);

  const addCondition = () => {
    setStorage((_, _storage = _!) =>
      produce(_storage, (draft) => {
        draft.conditions.push(getNewCondition());
      })
    );
  };

  return <Component {...{ addCondition }} />;
};

export default Container;
