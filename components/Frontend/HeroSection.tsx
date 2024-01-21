import AnimatedWave from './AnimatedWave';
import { Cabin } from 'next/font/google';

const cabin = Cabin({
  subsets: ['latin'],
  style: ['normal', 'italic'],
})

const HeroSection = () => {
  return (
    <>
      <div className={`flex h-[60vh] items-center justify-between max-w-7xl mx-auto py-6 px-4 sm:px-6 md:px-8`}>
        <div className="hero-text flex-1">
          <h1 className={`${cabin.className} hero text-7xl font-bold italic uppercase mb-4 tracking-tighter`}>Wifi Menu</h1>

          <p className={`${cabin.className} hero text-xl font-bold italic mb-4 text-gray-500 pr-8`}>
            Transformați experiența clienților într-un festin digital!
            Creați meniul online al restaurantului dvs. și generați coduri QR
            pentru mesele dumneavoastră cu ușurință.
          </p>
        </div>

        <div className="hero-image flex-1">
          {/* Add your hero image here */}
          {/* <img src="your-hero-image.jpg" alt="Hero Image" /> */}
          <span>test</span>
        </div>
      </div>
      <div className={`bg-[#a855f7]`}>
        <AnimatedWave />
        <section className='max-w-7xl mx-auto py-6 px-4 sm:px-6 md:px-8'>
          hello
        </section>
      </div>
    </>
  );
};

export default HeroSection;