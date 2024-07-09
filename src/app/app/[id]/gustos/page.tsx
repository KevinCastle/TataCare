'use client';

import FormModal from '@/app/components/formModal';
import { useElderStore, useTasteStore } from '@/app/store';
import {
  Heart, Smiley, SmileyAngry, SmileyXEyes,
} from '@phosphor-icons/react/dist/ssr';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Card from '@/app/components/card';

function Page() {
  const pathname = usePathname();
  const elderId = pathname.split('/')[2];
  const tasteTypes = [
    {
      id: 'pleasure',
      name: 'Le gusta',
    },
    {
      id: 'displeasure',
      name: 'No le gusta',
    },
    {
      id: 'avoid',
      name: 'Le hace mal',
    },
  ];

  const { getElder, selectedElder: elder } = useElderStore((state) => ({
    getElder: state.getElder,
    selectedElder: state.selectedElder,
  }));

  const { getTastes, tastes } = useTasteStore((state) => ({
    getTastes: state.get,
    tastes: state.tastes,
  }));

  const getTastesByType = (type: string) => {
    if (type === 'pleasure') {
      return tastes.filter((taste) => taste.pleasure === true);
    } if (type === 'displeasure') {
      return tastes.filter((taste) => taste.displeasure === true);
    } if (type === 'avoid') {
      return tastes.filter((taste) => taste.avoid === true);
    }
    return null;
  };

  useEffect(() => {
    if (elderId) {
      if (!elder && elderId) {
        getElder(elderId);
      }
      if (elder) {
        getTastes(elderId);
      }
    }
  }, [elder, elderId, getElder, getTastes]);

  return (
    <main className="h-[calc(100vh-64px)] lg:h-[calc(100vh-32px)] 2xl:h-[calc(100vh-64px)] px-4 md:px-8 relative">
      <header className="flex justify-between mb-4 pt-10">
        <div className="flex items-center">
          <Heart color="#006FEE" className="text-xl lg:text-3xl mr-[2px] lg:mr-2" />
          <p className="text-base lg:text-2xl font-medium">Gustos</p>
        </div>
        <FormModal type="taste" />
      </header>
      {tastes.length === 0 ? (
        <div className="flex justify-center items-center w-full h-[calc(100%-96px)]">
          <p className="text-xl text-center">Aún no tiene gustos registrados</p>
        </div>
      ) : (
        <article className="grid grid-cols-3 gap-4 pb-10">
          {tasteTypes.map((tasteType) => (
            <section className="col-span-3 sm:col-span-1" key={tasteType.id}>
              <p className=":text-xl font-medium text-center">{tasteType.name}</p>
              {getTastesByType(tasteType.id)?.map((taste) => (
                <Card
                  type="taste"
                  edit
                  remove
                  id={taste.id}
                  key={taste.id}
                  className="h-auto mt-2 lg:mt-4"
                >
                  <div className="flex justify-between">
                    <p className="text-lg font-medium text-zinc-900 text-pretty ms-1">{taste.detail}</p>
                    {tasteType.id === 'pleasure' && <Smiley size={28} color="#12a150" weight="fill" />}
                    {tasteType.id === 'displeasure' && <SmileyAngry size={28} color="#c20e4d" weight="fill" />}
                    {tasteType.id === 'avoid' && <SmileyXEyes size={28} color="#c4841d" weight="fill" />}
                  </div>
                </Card>
              ))}
            </section>
          ))}
        </article>
      )}
    </main>
  );
}

export default Page;
