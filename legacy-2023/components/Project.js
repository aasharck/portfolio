import Image from 'next/image'
import React from 'react'

const Project = ({name, url, desc, imgUrl}) => {
  return (
    <div className='md:flex block bg-black p-3 rounded-xl mt-3'>
          <div className='block md:p-5 p-2 w-auto md:w-3/5 md:py-10 py-8'>
            <a href={url} target='blank' className='flex hover:cursor-pointer'>
              <h1 className='pl-3 xl:text-5xl text-4xl font-bold text-violet-300'>{name}</h1>
              <span className='mb-3 ml-1'><Image width={25} height={25} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAwElEQVR4nO3XTQrCMBDF8bmE4iUDb0gW3ktPYPEC7cLjRBSFLvxom8DMwPtBF92U9y9dpCJEREREROEAuKpq7XEBGCwChl4BqlolkpTSDsAYMiDnvAcwvT6dKVTA/M0DuJVSDmECPo0XEQkR8G18iIBf490H/BvvOmDJeLcBS8e7DFgz3l3A2vGuAraMdxOwdbyLgJbx5gGt400Deow3DVDV8/tI/DgiNzynmgQAOAI4tYyf/dldnjdERERERBLJHXJrTgd+S7SKAAAAAElFTkSuQmCC" /></span>
            </a>
            <p className='pl-3 mt-2 text-white md:text-sm text-xs'>{desc}</p>
          </div>
          <div className='flex justify-center items-center md:h-auto w-auto md:w-2/5'>
          <div className='w-auto'>
            <Image alt={name} src={imgUrl} width={300} height={300} />
          </div>
        </div> 
        </div>
  )
}

export default Project