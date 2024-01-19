import React from 'react';
import Image from 'next/image';
import illustration from '../public/illustration.svg';

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl" style={{ marginBottom: '40px' }}>
        Welcome to the NTUAflix Database!</h1>
      <Image src={illustration} alt="Illustration" width={400} height={400} />
    </div>
  )
}