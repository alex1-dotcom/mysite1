import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mastering Modern UI/UX Design",
  description: "A premium online course on building high-end digital interfaces.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg-primary text-white antialiased">
        {children}
        <Script
          id="voiceflow-widget"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(d, t) {
              var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
              v.onload = function() {
                window.voiceflow.chat.load({
                  verify: { projectID: '69f6e881d8bf4ff14739bca3' },
                  url: 'https://general-runtime.voiceflow.com',
                  versionID: 'production',
                  voice: {
                    url: "https://runtime-api.voiceflow.com"
                  },
                  assistant: {
                    image: '',
                    stylesheet: '/vf-custom.css',
                    avatar: {
                      hide: false
                    },
                    header: {
                      hideImage: false
                    },
                    banner: {
                      hide: false
                    },
                    launcher: {
                      type: 'icon'
                    }
                  }
                });
              }
              v.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs";
              v.type = "text/javascript";
              s.parentNode.insertBefore(v, s);
            })(document, 'script');`,
          }}
        />
      </body>
    </html>
  );
}
