import '../styles/globals.css'
import { AuthProvider } from '../lib/auth/AuthContext'
import Layout from '../components/layout/Layout'

function MyApp({ Component, pageProps }) {
  // ログインページとサインアップページではレイアウトを使用しない
  const isAuthPage = Component.authPage;

  return (
    <AuthProvider>
      {isAuthPage ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </AuthProvider>
  )
}

export default MyApp