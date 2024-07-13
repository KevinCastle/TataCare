'use client';

import { Elder } from '@/app/api/elders/types';
import { useElderStore } from '@/app/store';
import { Avatar, Button } from '@nextui-org/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function Page() {
  const [elder, setElder] = useState<Elder | null>(null);

  const { addElderShared, isSharedLinkAvailable, loading } = useElderStore((state) => ({
    addElderShared: state.addElderShared,
    isSharedLinkAvailable: state.isSharedLinkAvailable,
    loading: state.loading,
  }));

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const sharedId = searchParams.get('sharedId');
    const fetchElder = async () => {
      if (sharedId) {
        const elderData = await addElderShared(sharedId);
        setElder(elderData);
      }
    };

    fetchElder();
  }, [addElderShared]);

  return (
    <main className="bg-zinc-200 h-[calc(100vh-64px)] lg:h-[calc(100vh-32px)] 2xl:h-[calc(100vh-64px)] flex flex-col justify-center items-center">
      {loading && <p className="text-xl">Cargando</p>}
      {!loading && !isSharedLinkAvailable && (
        <>
          <p className="text-xl">Este link está vencido, por favor solicite uno nuevo.</p>
          <Link className="mt-4" href="/">
            <Button type="button" color="primary">Ir al listado de abuelitos</Button>
          </Link>
        </>
      )}
      {!loading && isSharedLinkAvailable && elder && (
        <div className="flex flex-col items-center">
          <Avatar src={elder.avatar} className="w-48 h-48 text-large" />
          <p className="text-xl mt-4">{`¡Se ha agregado a ${elder.name} a tu lista con éxito!`}</p>
          <Link className="mt-4" href="/">
            <Button type="button" color="primary">Ir al listado de abuelitos</Button>
          </Link>
        </div>
      )}
    </main>
  );
}

export default Page;
