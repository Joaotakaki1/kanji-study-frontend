import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import Layout from '../components/Layout';
import { AuthProvider } from '../context/AuthContext';
import { swrConfig } from '../lib/swr-config';
import '../app/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={swrConfig}>
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </SWRConfig>
  );
}

export default MyApp;
