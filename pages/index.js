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
      <main className='m-8'>
        <div className='flex bg-white p-3 rounded-xl'>
          <h1 className='pl-3 text-2xl font-bold text-black'>Aashar Ck</h1>
        </div>
        <div className='flex mt-3'>
          <div className='flex-auto bg-white p-3 rounded-xl py-8'>
            <div className='block'>
              <div className='pl-3 text-black font-bold text-xs'>Auditor / Part time Builder</div>
            </div>
            <div className='block'>
              <h1 className='pl-3 mt-2 text-black font-bold text-5xl'>Blockchain Developer</h1>
            </div>
            <div className='block'>
              <p className='pl-3 mt-2 text-black font-bold text-xs'>I'm Aashar ck, a passionate blockchain developer with expertise in creating innovative solutions for complex problems. Let's connect and explore how my skills and experience can exceed your expectations.</p>
            </div>
          </div>
          <div className='flex-auto bg-black p-3 rounded-xl'>
            <Image className='mx-auto' src="/github.svg" width={120} height={120} />
          </div>
        </div>
      </main>
    </>
  );
}
