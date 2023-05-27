import Project from '@/components/Project';
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
          <div className='flex-auto bg-white p-3 rounded-xl md:py-4 py-5 xl:w-1/3 lg:w-5/6 md:w-1/3 w-auto'>
            <div className='block'>
              <div className='px-3 text-black font-bold md:text-xs text-xxs lg:pb-2'>Freelancer / Part time Builder</div>
            </div>
            <div className='block'>
              <h1 className='px-3 mt-2 text-black font-bold tracking-tight text-2xl md:text-3xl xl:text-5xl lg:text-4xl'>Blockchain Developer</h1>
            </div>
            <div className='block'>
              <p className='px-3 mt-2 text-black font-bold lg:text-sm text-sm'>Hey, I'm Aashar Ck. I code and audit smart contracts, and also enjoy building different things on the internet.</p>
            </div>
          </div>
          <a href='https://github.com/aasharck' target='blank' className='hover:animate-wiggle md:block hidden md:ml-3 md:mt-0 mt-3 bg-black p-3 rounded-xl lg:w-auto w-auto hover:cursor-pointer'>
            <Image className='mx-auto xl:mt-1 lg:mt-4 md:mt-2' alt='github.com/aasharck' src="/github.svg" width={120} height={120} />
          </a>
        </div>
        
        <div className='flex md:hidden'>
          <a href='https://github.com/aasharck' target='blank' className='hover:animate-wiggle md:ml-3 md:mt-0 mt-3 block bg-black p-3 rounded-xl lg:w-auto w-1/3'>
              <Image className='mx-auto mt-1 md:mt-4' alt='github.com/aasharck' src="/github.svg" width={80} height={80} />
          </a>
          <a href='https://docs.google.com/document/d/1g8O8VrkkOag6qaY26GLfar93Jb7sSeaXh8YNl9eSDgg/edit?usp=sharing' target='blank' className='hover:animate-wiggle hover:cursor-pointer flex justify-center items-center bg-white mx-auto mt-3 p-3 rounded-xl w-full h-auto'>
            <div className='text-black font-bold text-2xl'>Résumé</div>
            <span className='mb-3'><Image alt='resume' width={20} height={20} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAwElEQVR4nO3XTQrCMBDF8bmE4iUDb0gW3ktPYPEC7cLjRBSFLvxom8DMwPtBF92U9y9dpCJEREREROEAuKpq7XEBGCwChl4BqlolkpTSDsAYMiDnvAcwvT6dKVTA/M0DuJVSDmECPo0XEQkR8G18iIBf490H/BvvOmDJeLcBS8e7DFgz3l3A2vGuAraMdxOwdbyLgJbx5gGt400Deow3DVDV8/tI/DgiNzynmgQAOAI4tYyf/dldnjdERERERBLJHXJrTgd+S7SKAAAAAElFTkSuQmCC" /></span>
          </a>
        </div>
        <div className='flex mt-3'>
        {/* bg-gradient-to-br from-pink-800 to-purple-900 */}
        <div className='block bg-violet-700 w-2/3 rounded-xl p-4 py-auto'>
          <div className='text-white font-bold text-lg lg:text-2xl'>Audit Findings<span className='lg:text-sm text-xxs text-slate-300'>&nbsp;&nbsp;(C4 and Sherlock)</span></div>
          <div className='flex mt-4'>
            <div className='w-1/3 font-bold text-black'><span className='text-2xl lg:text-5xl text-white'>4</span><span className='md:text-xl text-xs'>&nbsp;&nbsp;High</span></div>
            <div className='w-1/3 font-bold text-black'><span className='text-2xl lg:text-5xl text-white'>2</span><span className='md:text-xl text-xs'>&nbsp;&nbsp;Med</span></div>
            <div className='w-1/3 font-bold text-black'><span className='text-2xl lg:text-5xl text-white'>2</span><span className='md:text-xl text-xs'>&nbsp;&nbsp;Low/QA</span></div>
          </div>
        </div>

          <a href="https://cal.com/aashar" target='blank' className='hover:animate-wiggle block ml-3 bg-white rounded-xl w-1/3 p-4 py-auto'>
            <div className='text-black text-sm font-bold'>book a call with me</div>
            <div className='text-black text-xl xl:text-5xl lg:text-4xl font-bold mt-3'>Cal.com</div>
          </a>
        </div>
        <div className='flex mt-3'>
        <a href='https://docs.google.com/document/d/1g8O8VrkkOag6qaY26GLfar93Jb7sSeaXh8YNl9eSDgg/edit?usp=sharing' target='blank' className='hover:animate-wiggle hover:cursor-pointer md:flex hidden justify-center items-center bg-black mx-auto p-3 rounded-xl w-full h-auto mr-3'>
            <div className='text-white font-bold text-2xl'>Résumé </div>
            <span className='mb-3'><Image alt='resume' width={20} height={20} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAwElEQVR4nO3XTQrCMBDF8bmE4iUDb0gW3ktPYPEC7cLjRBSFLvxom8DMwPtBF92U9y9dpCJEREREROEAuKpq7XEBGCwChl4BqlolkpTSDsAYMiDnvAcwvT6dKVTA/M0DuJVSDmECPo0XEQkR8G18iIBf490H/BvvOmDJeLcBS8e7DFgz3l3A2vGuAraMdxOwdbyLgJbx5gGt400Deow3DVDV8/tI/DgiNzynmgQAOAI4tYyf/dldnjdERERERBLJHXJrTgd+S7SKAAAAAElFTkSuQmCC" /></span>
            
          </a>
        <div className='flex justify-center items-center bg-white mx-auto p-3 rounded-xl w-full h-auto'>
            <div className='flex text-black font-bold text-2xl gap-1'>
              <span><Image alt='solidity' width={50} height={50} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAD40lEQVR4nO2dTWhVRxTHf601aqhWglj7YRWloqJgaKEEWmg3JVixGlfGjUrjxrhRseJHumm76eeq6aaKUUvTVZuFLaigoqCiUkFQoy0UirUipUm/Y5Mp094LISTx3ffm3jlz5/zgD293Z/5neO++mXPOgKIoiqL4ZQVgCtYrGvT/qQOuewjATWBSMoao2enB/FSvEzmzgD6PAfgVeJyIOejR/FRdREoTMCQgAHYMLxAZDwLnBZif6hIwgYjYJMB0M0JtRMJ04I4Aw80I3QUaiIAPBZhtxtAHlJzFwIAAo80YugcspcR8LcBkcx8dp6SsEWCuqVAtlIwpwHcCjDUV6nugnhLxhgBTTUZ1UBJmA78JMNRk1B/AXErA5wLMNFWqm8B5Xsh+j6lBLxEodm/lsgADTY26AjxEgGwRYJ5xpHYCoyHZWzEl0c/ADALiYwGmGcfqJBAagX8EGGYcaxB4lgA4VaApQ8nXQ1HqIQAOFxiAQ74nK5EnkmyDvM3/HXjK92SlsruAAOzyPUnp2W69OZr/LTDZ9ySl82qOAVjpe3KhcCQH84/6nlRIPA385dD8AWCh70mFxrsOA/CO78mEyFTglgPzbwOP+J5MqGxwEID1vicRMg8AZ2sw/0KST6rUwDPJhlZW8weB59R5N+yrIgCfqPnumAn8ksH8fuAxDYBbtmUIwFY13z0TgasVmN+rVYz50VxBAJpzPrWzipovxzH/i5xfiU8CZ5LP0TIP+HMU8/9O9pDyYt2wZ7USOW+NEoA3c3xefZL5nD7rB+BhIqa+YEPeHiXgdhFETeswM9bm+Jz543zlLSByTgCnc/5R7BnnR9++EERNY86vhb5fe4k9QeBaBQG4oX/88mF7hq0Pu02iOORR3fzzy/4qtr/tlrni8QDIJvzqAVCN2ONLPQL1yMYqVv5I2UQCxWMazE+aBlMd7zkwP5VNKlMysMhxOxzbvmZJlgHEzlcOzU+lycAVsioH81PZVHtlHGwLYi0I8cieHFd/Klt2pYxRFFhEOxwtChyDTwswP5UtwRVPT8HF00MFBsAWoYtnmbYq8E9ngavSFKSPCAhtVyOAdgGr1jjSZgJtWfaNAPNMrC3LytK070UCp1uAiaZKfUYJeDLgxq1zKAkdAgw1GbWXEmFby2jzbs+0CFjVpkKtpqSEcIHDMUqM6zNb41ilv8KE5KIcI1TvEwHTgB8FmG1GyQOyV2xFQZsAw80IvUZkuZvnBJie6mKM7XCahOwTRXmZZ0qXgAAcIPIKlj6P5vfHfqEzybXivgKw478RRE5dhVWMrqVVkcN42UMAlg8fgKIoiqJQMP8Cdx1tGULwY0QAAAAASUVORK5CYII=" /></span>
              <span><Image alt='react' width={50} height={50} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAKvklEQVR4nO1dDZBXVRX/IRSglO5Mls5kLOJCkqKyYuqM5gdMWAqFApN9aGoGKJVW5Kil6OiIo9OHTcRimQxWkxpafiR+YcaAMJqjRQxobSAmJgsDy8Li/vc1xzn/5s3zf8499737/nsX/7+ZMwP7f/e+886799zzde8DGmiggQYaaKCB9wyOADAJwDQm+vfRAAb1NWP7Mo4HsAjAmwASgfYAWAPgRgBjS+ZnCIAjAbQyjeG/7XM4BMDvFaEnCv0DwGUAhgbg4yAAFwC4G8A/hfv1AngZwHx+If0eZwD4b07hJynaAuBqAAfk5OF+nl0+96xwu+HopyC93hVA+EmKNgI4z3j/cwCsDnDP7QCmo59hFIAdgYWfpOgxACOEe38CwOOB70ezYSb6CciSedHxQD0A/gJgCYCfA1gKYG3Bkfl+ADcBeLukl07rw2T0A3xdeQgSzi0APiq0PRTALE/VQZbVJwH81VOgxMvfADwN4FkA/2Yha222xb4m0Ch8XWB+F4BPefR1MoBHA4/iDgALAUwQFvQWALc5FuzfIWLMUBjPu5CdAeDvBQXfDuByD3P2GGUgEZ2ESPGYwPDDBft9H4BrAOz1FPwubjc4xz2PUqy4XyNC7A9gt8DwqYHu0QpgvVH4DwJoLni/7wp9dwP4ECLDpxXbfUCgexzlCGVUiRbTCwPcj1TWG8I9voTIcLXA6J0Bhb/FQ/30BHKgfthf1NASgdFLA/Q9xlP4VdrLHnERnCb0/Soiw3MCo6Saigr/DYe62ab8TuvSxIJr217hvh9ARHhVEMCxBfo8zGEO9vAMGw1gs8MaonB4XkjR0yJ9Boc0CikcnQfDHN7tXvY70vGn15TrN7GnnQfPCH2ejYgg2cx5khz7AXjAMfIpk1ZLXb2ltFuZk597hP4uRkTYLjCZJ4Y/3xGZ/LLS9kQAnUr7xTn4+ZHQ1xxEBMk+p0yUD77qsGy6ObTQkVF72/lv5HfsdPRBDlaIF0DZumgg6V8p8kkYyMn4iwAsAPA8q5ekZKrw+tIG4GtsKGgFAT8R+qHIbTSQAmbjM9eNAzCPQ8CddRC2lWgNW8G8tWa897tL9HGCQQodT+Xw7x0cc0/6Cb3Gs/IzSpDx84gICwUm66FSkj4iyllEg2siEEhSZ5Ly0n2Cm0p4wIcAXM+L3RQ2MQ/nMHNTxsI6iP/WzNecyG1ms17/Qwn8nR8w0lsoSvlUCQ/3XOBSxYG8yIbmcyXnpOuOYWwf+1YhdHIVxDw2BxMhdkOhhTJqUiXLq8I8Lc1hnVHbn7JM6gLKma7zYLCbQwtTU6GApcr1s0vkfZZyX+IJzOM0zqp1e5ZSll3T+k4ATEo9SkQmaBqTlWsfL1mvDnAUbmVrf1bl8CdqxamC4BuK2tDolUyar124bjeXhpSNFmUQtaeqJ5pymtEVrsKo29StUodS3EQxey3RnbDFUy9cr/Axl685V/h9Kz+rSx7BPOUphpFAUcaDlaq2K3lESYyvr3N9/hClwqKDeV0g/N7Gz7rYIZOeEDmDjzne9u5MXPz7wnVPOMLMkzx4msglievYYunkBbCNwx5WTFL4uZVVpysEcYljTdzKmb3c0BasjRy4SuM44dpuJWmzzMjLKCU7lablHmvJMoVfKRP3wUwf4x3ZOOvzvQtnO4RPHmctK2OTQUjpBWucgZdTjXo3rUZOMfQ7ztOwoJdbCyMdz01BPW+sURwl8gUkSLqzFt1jHPk+wk9Pf3K+8qYca9H3lH6OY9nUakfmrBeOUZiYYxitlofpNga0LGpHIio/d2GE0eHqNZQ7flNpT8mnwmbaOk6aaxigLGC+VXMTCwi/Smca7nOnoZ8/G2NOG4T21yHA4nuFsb1kDVWpkvINNCwK8AIoV+FCi8HUttr13xbaU2LHDGlBoeinBcMdi9u9xn7WBXgBZKJa8Buljz3sG1hwtGK4mNEVoMzkSeWBrFVlOwK8AOrDgrGKJ09bVq0YJvRBC3RdX8D9Qh+9HlHDHXV8AccrfdBgqusLKKqCmhx7rWi610sF0Q7MIgMmYXVq3aA3VuiDihIKL8IU07HgUodQeoze6qI6LcIfNzhkZFhY8J0Qi7Bkhq5nU8uFZw2CWWToZ0KAF0Ab/Vy4y9DPBkOuYpBigv8AHpCmUcLOhsuxce259XHElhcQPuWrXRjpsQHQFd64QmlrVd//x2plMdHq/q/yENASAx8tJYciNPMzSz9T+mlVjBdK3nvjswojm3jkFA0dVIzBuFNYoD7CtwTjWo2z1bXpsMWxSeQslBCO3lSj9vNAZTp3FwzXtnBsx6J2jij4fF0Kv9nZf4JD+F6LbxaHGRIylJSoYqpw3Suc5AiRkDmTLZu1XIq+k/+90LjgWhIy8zmJ5LKGLnGY2285KsRNmOyRkmwTfl8QYUpygyMleaXw+2qPlCSp8SCYaZj6HYqepgQ3OOEdQ1J+nmEDx2jh916jUUB7D4JiTs6ylJ5UICuGspRRitpIl6XAGFbPUqXM3TPTcxRmrYqsMOtJj8KsOzyftcvjWLXcGJujNPFBfnlDDaWJs0rk/XJjaeJ5XE7pW5rolfUqgmFckOqrkjr5wW5Q2nZ6mJE+GK3kbCvM0wM5inPf5kLluhXnZm3glTn0pItWGGNOVgxSjlMoQk/lCTGUoVfPL+Hh/sjWCi1on+OTqkZyOUxTJkNV/f8IvuakzAaNh0rgjzalRIORJTxgEjnRET3R4OQIBJKURJITSkduRgMpBPEnDkQtcJTvJZFRO2/QnqBUST+CfnBe6K8ya0Ure7wrSjjaOClAOzmKex1XuGUNjVptaHN6NJgtMPljh2VyLLvsbXx8QB5PO49KeZ5n5UVsxQx0VIhL0eBocJnAJJ255oO5hpG6kWMx6RNatvHf2g3OEx0I4oMmoR86oCQazBGYJAfFF4sV4XXyHmAJX3HMIgoz+0IqM6EBEA0uLpByzGKIY3PcVj4lvdYGwh5HqMFV1yrxU6s/WsOiwTme9fQuHOqwmjZn9hJ/wZFYfyHn4VHgY9dq9UkqLxqcYNgh6YvxSuym+hJGswVWcVxXJCsl7fqhhE40OFBIbncXzHRNdKT8tjmS6v/hj/UUwVkhKx3KxL8ERi3VCRom5zi4O+HzRseUuEU3z/lzpeK3AqO3B+h7huem6S3CQp0Hd+XYrtQnuEBRAyE+RXWhsYbnzYAh4v2UkhOfLbF1wYcVVUG7RoqgmbNqltG/vsb22bw4XTFBo/zwm6SGduUclYP5NC7NGqpFNBCu5Y8/FIG0j5jyC1FCC0u/7tjemnX/53LYISlAaz2LtdL4otJvtcwmStynML6Hv6RUa/v+UD5tfWEJR1o+wZVwAzyq76Ro7eYAM6tUNCtHGWcdmeVc77k2x+lbL7AD6LOJ4yU2K6VDxenTJDc7eEmXYkaLKZ5Vx4mnfr8xMwqnO74jkKVeLq25j2fcL3lTieubk2sCFwuUipklxPeXKc5VM2fgkpJou1KSHy1mGNVR4qBVHp8jOTfA4p2lXTHa/VYM5x2IvrOhi81any/wVXEAm6GhPqcb6lNcfYoxbAG9JLyMCjtRv2ATMHsuD3ImU77F3430FXwvrxEfwT6IwRxKbmUaxd+iLBPjuZhqlSOutJHzxXWr83wvYggLeAofMzmNHbZah1A10EADDTTQQAPYB/E/ZrcChWRzvsgAAAAASUVORK5CYII=" /></span>
              <span><Image alt='html' width={50} height={50} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFj0lEQVR4nO2daYiWVRTH/zOWWbbQopEWhmm0kMQErRMt+KGCwsSUNhdoUTKlPhgRLbRhkNREC5PEhBhqi9FCYkJCCySWkPAKRtqOaTOQWYZZPnHgfBj80Nz3+Z+7ve/9wfn63HP+//c+8zz3ufcMUCgUCoWCX6YD+AVAVQJ1NNihGprQCeD3YgTYH+Nu1ZJmRDEDVncG0dIEcbfcrkBp8BsM+boYAvYHudXSkE+LIWAN+cTSkLeKIWANedPSkBeLIWANecHSkIeLIWANecjSkLnFELCG3GlpyPXFELCGiIZmXFIMAWvIxZaGTCiGgDXkNEtDjiqGgDXkSBjzZzEFdc3YCw98WwxBXUO2+zDk82II6hoi2pnzTjEEdQ0R7cx5mTBkCYDxmcfTRP1LfRjyOJFQD/LnWaL+x3wkdDeR0Erkzwqi/vk+EppOJLQe+fMRUb/ZBofBXEYktAX50yDqF+3MOYNIaAD58ytRv2hnzrFEQgcADEe+HALgX6J+0c6cDgD7iKTGIl9OIurep9p54ScisS7ky7lE3T/6TOwLIrGrHccYl8BL4MFxK1H3lz4N+YBIbJbjGNuJMVIM0cwbfURii9p0EbPPpyGLyfWsdlzEXOzTkHuJxJY7jrE0AREt4x6fhtxMJLYuwCJmlWDc5NOQyURimx3HWJCAiJYhmnnjHCKxnY5jzEhARMsQzbwxmkjsHwDDHMa4IgERLUM084YcydpPJHeiwxhnJSCiVbj+CCmYw5+THK5/fAJCWoVo5Z2vUv0D54kriXpFK++sIxKUx+bcuJGo98MQCS4nEpQXy9xYGOBlmGIJkeBTyI8nAywXUSwiEnwV+fFKgAVVillEgmuQH+8H+ORAcRWR4Cbkx8YAH+UouogEf0Z+/JD6Z+uxRIL7rRqwBOSv1Dd2HKrbeuomOUVfEGPHSIdaj8ll69MAkWgqMcahztNz2Ry4JQFBK/LXKzN9KC7NZfvs+gRErYjod6xzWi4bzFcmIGpFhGycduEuYoxVCEhPAqJWRMjRAhceJcZ4DgF5IAFRKyLk8I0LvcQYolEwbktA1IqIZxzrfJsYQzQKxrXkbvBtDtHv0ZD7Hev8jBjjOgTkfCLR7xzHmOPRELm2C9uIMS5AQMYRicpShAvXeDREru3CH8QYpyIgh5OCHO0wxnkeDZFrD8VIcowjEBiml+9Eh+uf7NEQufZQjCeuL53Ag8P08u12uP5wAO8Z95zfqdd0WfS7kBjnG0SA6eU7tcmxxuiT3SMqqMvi5t964kteYmcCOLvJs35TiPpEm+AwvXznkWN3qsCztf3qRl0O6dNrdzkuHv4ftxP1rUYEmF6+0nY2dR4k6nspRsJML18xM3WeJ+qTW2tw5hEJy+0udd6IeEuuxdRUGtN74uOADy3Re/nKI3PqbCXqE22CM4E8N7FW+0jJMkwqnKK3mzXkORj5Fh8cy16+DT0+3B1hm5A8Pt+n7w7Mbppml4a84KOX7y4AywDcoKZbM0K3AfVoHxLr/F0XT5FjL9+9eh5lIbnpbJS+rb8e4D/OuX5e8ELoNhiNQbe2jiZuRUyvq2ZjAyLybmBDqoN+ib26xnWYNhnrVsOYJyQ2RJNopNIGY3dC//xSzpNEo9XaYFQG8URMQ5hevq0aC2IawvTybdWYEdMQppdvq8blMQ05MwEBqsRCWoNE47gEBKgSC2kNEo0O8gxeq8X3Pnv0unKRvp1aLcxVGcYB1UC0SIZRuiC4rEWOvFVDxB7dAXOH4z6vqAzT3YEx1pKqAGtpkw12tUQl19mzZ9AsyLl3fdazp9Eqs6AuJ+js6QWwI4IBA/qdpKVnQV06A82etp8FsWdP/6BZ4NIwoOBh9jTa/W9BaEbrd/IVujFCjhq8BuAWfaorFAqFQgHtxH/bYzoIsYOD+AAAAABJRU5ErkJggg==" /></span>
              <span><Image alt='tailwindcss' width={50} height={50} src="data:image/png;base64,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" /></span>
              <span><Image alt='nextjs' width={50} height={50} src="https://svgshare.com/i/rdM.svg" /></span>
            </div>
        </div>
        </div>
        
        <Project 
        name='auditjobs'
        desc='a curated list of all the top oppurtunities in Blockchain security and Smart contract auditing. currently at $20 revenue'
        url='https://auditjobs.xyz'
        imgUrl='/auditjobs.xyz.jpg'
        />

        <Project 
        name='keepshipping'
        desc='a platform that lets people share what they shipped with the world. like product hunt but with no bots and no users(duh!).'
        url='https://keepshipping.xyz'
        imgUrl='/keepshipping.jpg'
        />

      <Project 
        name='copygen'
        desc='a useful copywriting tool for dropshippers and online sellers that lets them create product copies and ad copies just from a product link'
        url='https://copygen.xyz'
        imgUrl='/copygen.jpg'
        />

      <Project 
        name='bitcourse'
        desc='An online learning platform like udemy but on the blockchain. Tutors can create courses as NFTs and the students have the abilitiy to sell them.'
        url='https://bitcourse.io'
        imgUrl='/bitcourse.jpg'
        />

    <Project 
        name='readingmood'
        desc='Find the perfect song that exactly matches the book that you are reading. Built this as a part of a challenge from Buildspace'
        url='https://readingmood.co'
        imgUrl='/readingmood.jpg'
        />
        
      </main>
    </>
  );
}
