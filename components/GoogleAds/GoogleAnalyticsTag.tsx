// components/GoogleTag.js
import Script from 'next/script';

export default function GoogleAnalyticsTag() {
  return (
    <>
      {/* Google Tag Manager Script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-658422DTZ4`}
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-658422DTZ4');
        `}
      </Script>
    </>
  );
}
