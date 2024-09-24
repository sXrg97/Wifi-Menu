import { useEffect } from 'react';

const AdSenseAd = () => {
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div
      className={`h-full border-gray-300 product-box border p-4 rounded-sm hover:shadow-lg transition-shadow relative overflow-hidden flex flex-col justify-between gap-4`}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-5014917614845643"
        data-ad-slot="4174871773"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdSenseAd;
