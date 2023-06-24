import React, { Suspense, VFC } from 'react';
import { RecoilRoot } from 'recoil';
import { SnackbarProvider } from 'notistack';
import { restoreStorage } from '@/common/plugin';
import { PluginErrorBoundary } from '@/common/components/error-boundary';
import { PluginBanner, PluginContent, PluginLayout } from '@konomi-app/kintone-utility-component';
import Form from './components/form';
import Footer from './components/footer';
import { storageState, pluginIdState } from './states/plugin';
import { Loading } from '@/common/components/loading';
import { URL_BANNER, URL_PROMOTION } from '@/common/statics';

const Component: VFC<{ pluginId: string }> = ({ pluginId }) => (
  <>
    <RecoilRoot
      initializeState={({ set }) => {
        set(pluginIdState, pluginId);
        set(storageState, restoreStorage(pluginId));
      }}
    >
      <PluginErrorBoundary>
        <SnackbarProvider maxSnack={1}>
          <Suspense fallback={<Loading label='設定情報を取得しています' />}>
            <PluginLayout singleCondition>
              <PluginContent>
                <Form />
              </PluginContent>
              <PluginBanner url={URL_BANNER} />
              <Footer />
            </PluginLayout>
          </Suspense>
        </SnackbarProvider>
      </PluginErrorBoundary>
    </RecoilRoot>
    <iframe
      title='promotion'
      loading='lazy'
      src={URL_PROMOTION}
      style={{ border: '0', width: '100%', height: '64px' }}
    />
  </>
);

export default Component;
