import Head from 'next/head';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <Head>
        <title>Aashar Ck</title>
        <meta name='description' content='Fullstack Blockchain Developer' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='container mx-auto my-4 xl:px-96 lg:px-56 md:px-32 px-4'>
        <div className='flex bg-white p-3 rounded-xl'>
          <h1 className='pl-3 text-2xl font-bold text-black'>Aashar Ck</h1>
        </div>

        <div className='md:flex mt-3'>
          <div className='flex-auto bg-white p-3 rounded-xl md:py-4 py-5 lg:w-auto w-auto'>
            <div className='block'>
              <div className='pl-3 text-black font-bold md:text-xs text-xxs lg:pb-2'>Freelancer / Part time Builder</div>
            </div>
            <div className='block'>
              <h1 className='pl-3 mt-2 text-black font-bold text-3xl md:text-4xl xl:text-5xl lg:text-3xl'>Blockchain Developer</h1>
            </div>
            <div className='block'>
              <p className='pl-3 mt-2 text-black font-bold lg:text-sm text-md'>I code, audit smart contracts and occassionally build stuffs that no one cares.</p>
            </div>
          </div>
          <div className='md:block hidden md:ml-3 md:mt-0 mt-3 bg-black p-3 rounded-xl lg:w-auto w-auto'>
            <Image className='mx-auto mt-1 md:mt-4' alt='github.com/aasharck' src="/github.svg" width={120} height={120} />
          </div>
        </div>
        
        <div className='flex md:hidden'>
          <div className=' md:ml-3 md:mt-0 mt-3 block bg-black p-3 rounded-xl lg:w-auto w-1/3'>
              <Image className='mx-auto mt-1 md:mt-4' alt='github.com/aasharck' src="/github.svg" width={80} height={80} />
          </div>
          <div className='flex justify-center items-center bg-white mx-auto mt-3 p-3 rounded-xl w-full h-auto'>
            <div className='text-black font-bold text-3xl'>Résumé</div>
          </div>
        </div>
        <div className='flex mt-3'>
        {/* bg-gradient-to-br from-pink-800 to-purple-900 */}
        <div className='block bg-orange-600 w-2/3 rounded-xl p-4 py-auto'>
          <div className='text-white font-bold text-lg lg:text-2xl'>Audit Findings</div>
          <div className='flex mt-4'>
            <div className='w-1/3 font-bold text-black'><span className='text-2xl lg:text-5xl text-white'>3</span><span className='md:text-xl text-xs'>&nbsp;&nbsp;High</span></div>
            <div className='w-1/3 font-bold text-black'><span className='text-2xl lg:text-5xl text-white'>2</span><span className='md:text-xl text-xs'>&nbsp;&nbsp;Med</span></div>
            <div className='w-1/3 font-bold text-black'><span className='text-2xl lg:text-5xl text-white'>2</span><span className='md:text-xl text-xs'>&nbsp;&nbsp;Low/QA</span></div>
          </div>
        </div>

          <div className='block ml-3 bg-white rounded-xl w-1/3 p-4 py-auto'>
            <div className='text-black text-sm font-bold'>book a call with me</div>
            <div className='text-black text-3xl xl:text-5xl lg:text-4xl font-bold mt-3'>Cal.com</div>
          </div>
        </div>
        <div className='md:flex block bg-black p-3 rounded-xl mt-3'>
          <div className='block md:p-5 p-2 w-auto md:w-3/5 md:py-10 py-8'>
            <h1 className='pl-3 xl:text-5xl text-4xl font-bold text-white'>keepshipping</h1>
            <p className='pl-3 mt-2 text-white md:text-sm text-xs'>a platform that lets people share what they shipped with the world. Product hunt but with less bots and less users(duh!).</p>
          </div>
          <div className='flex justify-center items-center md:h-auto w-auto md:w-2/5'>
          <div className='w-auto'>
            <Image src="/readingmood.jpg" width={300} height={300} />
          </div>
        </div> 
        </div>
        <div className='md:flex block bg-black p-3 rounded-xl mt-3'>
        <div className='block md:p-5 p-2 w-auto md:py-10 py-8 md:w-3/5'>
            <h1 className='pl-3 xl:text-5xl text-4xl font-bold text-white'>copygen</h1>
            <p className='pl-3 mt-2 text-white md:text-sm text-xs'>a useful copywriting tool for dropshippers and online sellers that lets them create product copies and ad copies just from a product link (like alibaba)</p>
          </div>
          <div className='flex justify-center items-center md:h-auto w-auto md:w-2/5'>
          <div className='w-auto'>
            <Image src="/readingmood.jpg" width={300} height={300} />
          </div>
        </div>
       
          </div>
        <div className='md:flex block bg-black p-3 rounded-xl mt-3'>
        <div className='block md:p-5 p-2 w-auto md:w-3/5 md:py-10 py-8'>
            <h1 className='pl-3 xl:text-5xl text-4xl font-bold text-white'>readingmood</h1>
            <p className='pl-3 mt-2 text-white md:text-sm text-xs'>Find the perfect song that exactly matches the book that you are reading. Build this as a part of a challenge from Buildspace</p>
          </div>
          <div className='flex justify-center items-center md:h-auto w-auto md:w-2/5'>
          <div className='w-auto'>
            <Image src="/readingmood.jpg" width={300} height={300} />
          </div>
        </div>        
          </div>
      </main>
    </>
  );
}
