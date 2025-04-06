import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { Toaster } from './components/ui/sonner.tsx';
import './i18next';
import './index.css';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

import { Buffer } from 'buffer'
globalThis.Buffer = Buffer;

const domain = location.protocol + '//' + location.host;
const tonConnectManifestSrc = domain + "/tonconnect-manifest.json";



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TonConnectUIProvider manifestUrl={tonConnectManifestSrc}>
            { <App /> }
    </TonConnectUIProvider>
    <Toaster position="top-center" />
  </StrictMode>,
);
