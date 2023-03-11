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
      <main className='my-10 mx-5 xl:mx-96 md:mx-32'>
        <div className='flex bg-white p-3 rounded-xl'>
          <h1 className='pl-3 text-2xl font-bold text-black'>Aashar Ck</h1>
        </div>
        <div className='flex mt-3'>
          <div className='flex-auto bg-white p-3 rounded-xl py-8 lg:w-4/5 w-2/3'>
            <div className='block'>
              <div className='pl-3 text-black font-bold text-xs lg:pb-2'>Freelancer / Part time Builder</div>
            </div>
            <div className='block'>
              <h1 className='pl-3 mt-2 text-black font-bold text-2xl md:text-3xl lg:text-6xl'>Blockchain Developer</h1>
            </div>
            <div className='block'>
              <p className='pl-3 mt-2 text-black font-bold lg:text-sm text-xs'>I code, audit smart contracts and occassionally build stuffs that no one cares.</p>
            </div>
          </div>
          <div className='ml-3 flex-auto bg-black p-3 rounded-xl lg:w-1/5 w-1/3'>
            <Image className='mx-auto mt-1 md:mt-4' src="/github.svg" width={120} height={120} />
          </div>
        </div>
        <div className='flex mt-3'>
          <div className='block bg-black w-2/3 rounded-xl p-5 py-8'>
            <div className='text-white font-bold text-lg lg:text-2xl'>Audit Findings</div>
            <div className='flex mt-4'>
              <div className='w-1/3 font-bold text-slate-600'><span className='text-2xl lg:text-5xl text-white'>3</span> High</div>
              <div className='w-1/3 font-bold text-slate-600'><span className='text-2xl lg:text-5xl text-white'>2</span> Med</div>
              <div className='w-1/3 font-bold text-slate-600'><span className='text-2xl lg:text-5xl text-white'>2</span> Low/QA</div>
            </div>
          </div>
          <div className='block ml-3 bg-white rounded-xl w-1/3 p-5 pt-9'>
            <div className='text-black text-sm font-bold'>book a call with me</div>
            <div className='text-black text-3xl lg:text-6xl font-bold mt-3'>Cal.com</div>
          </div>
        </div>
        <div className='md:flex block bg-black p-3 rounded-xl mt-3'>
          <div className='block md:p-5 p-2 w-2/3 md:py-20 py-8'>
            <h1 className='pl-3 text-5xl font-bold text-white'>keepshipping</h1>
            <p className='pl-3 mt-2 text-white lg:text-sm text-xs'>a platform that lets people share what they shipped with the world. Product hunt but with less bots and less users(duh!).</p>
          </div>
          <div className='block mx-auto w-1/3 py-5'>
            <Image src="/readingmood.jpg" width={300} height={300}/>
          </div>
        </div>
        <div className='md:flex block bg-black p-3 rounded-xl mt-3'>
        <div className='block md:p-5 p-2 w-2/3 md:py-20 py-8'>
            <h1 className='pl-3 text-5xl font-bold text-white'>copygen</h1>
            <p className='pl-3 mt-2 text-white lg:text-sm text-xs'>a useful copywriting tool for dropshippers and online sellers that lets them create product copies and ad copies just from a product link (like alibaba)</p>
          </div>
          <div className='block mx-auto w-1/3 py-5'>
            <Image src="/readingmood.jpg" width={300} height={300}/>
          </div>        </div>
        <div className='md:flex block bg-black p-3 rounded-xl mt-3'>
        <div className='block md:p-5 p-2 w-2/3 md:py-20 py-8'>
            <h1 className='pl-3 text-5xl font-bold text-white'>readingmood</h1>
            <p className='pl-3 mt-2 text-white lg:text-sm text-xs'>Find the perfect song that exactly matches the book that you are reading. Build this as a part of a challenge from Buildspace</p>
          </div>
          <div className='block mx-auto w-1/3 py-5'>
            <Image src="/readingmood.jpg" width={300} height={300}/>
          </div>        </div>
      </main>
    </>
  );
}
