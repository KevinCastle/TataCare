'use client';

import { useEffect } from 'react';
import ElderCardList from '../components/elderCardList';
import SignOutButton from '../components/signOutButton';
import { useElderStore } from '../store/elderStore';

function Page() {
  const { getAll, elders } = useElderStore((state) => ({
    getAll: state.getAll,
    elders: state.elders,
  }));

  useEffect(() => {
    getAll();
  }, [getAll]);

  return (
    <main className="bg-zinc-200 min-h-svh relative">
      <SignOutButton />
      <article className="h-full py-4">
        <section className="row-span-1 flex items-center justify-center h-[25vh]">
          <h1 className="text-3xl text-center">Lista de abuelitos</h1>
        </section>
        <ElderCardList elders={elders} />
      </article>
    </main>
  );
}

export default Page;
