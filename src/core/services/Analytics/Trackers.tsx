import Script from 'next/script';

const YANDEX_METRIKA_ID = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
const MY_TRACKER_ID = process.env.NEXT_PUBLIC_MY_TRACKER_ID;

export function Trackers() {
  return (
    <>
      {YANDEX_METRIKA_ID ? (
        <>
          <Script id="yandex-metrika" strategy="afterInteractive">
            {`
              (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {
                  if (document.scripts[j].src === r) { return; }
                }
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
              })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
              ym('${YANDEX_METRIKA_ID}', 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true });
            `}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element -- трекинг-пиксель, next/image тут неприменим */}
            <img
              src={`https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}`}
              style={{
                position: 'absolute',
                left: '-9999px',
              }}
              alt=""
            />
          </noscript>
        </>
      ) : null}
      {MY_TRACKER_ID ? (
        <>
          <Script id="mytracker" strategy="afterInteractive">
            {`
              var _tmr = window._tmr || (window._tmr = []);
              _tmr.push({ id: '${MY_TRACKER_ID}', type: 'pageView', start: new Date().getTime() });
              (function (d, w, id) {
                if (d.getElementById(id)) return;
                var ts = d.createElement('script');
                ts.type = 'text/javascript';
                ts.async = true;
                ts.id = id;
                ts.src = 'https://top-fwz1.mail.ru/js/code.js';
                var f = function () {
                  var s = d.getElementsByTagName('script')[0];
                  s.parentNode.insertBefore(ts, s);
                };
                if (w.opera === '[object Opera]') {
                  d.addEventListener('DOMContentLoaded', f, false);
                } else {
                  f();
                }
              })(document, window, 'tmr-code');
            `}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element -- трекинг-пиксель, next/image тут неприменим */}
            <img
              src={`https://mytopf.com/counter?id=${MY_TRACKER_ID};js=na`}
              style={{
                position: 'absolute',
                left: '-9999px',
              }}
              alt="mytopf.com"
            />
          </noscript>
        </>
      ) : null}
    </>
  );
}
