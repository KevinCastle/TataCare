'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@nextui-org/react';
import Logo from './components/logo';

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-tl from-blue-900 via-blue-500 to-cyan-400">
      <article className="container mx-auto min-h-screen">
        <section className="h-screen flex flex-col justify-center">
          <Logo textWhite iconColor="#FFF" />
          <p className="text-xl text-white mt-3">Una app para cuidar a los tatas</p>
          <div className="flex items-center mt-12">
            <Button type="button" color="primary" className="py-3 px-5" onPress={() => router.push('/app')}>Empezar</Button>
          </div>
        </section>
      </article>
    </main>
  );
}
