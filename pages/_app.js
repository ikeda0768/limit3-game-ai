import "@/styles/globals.css";
import "@/styles/style.css"; // ← これでOK！

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
