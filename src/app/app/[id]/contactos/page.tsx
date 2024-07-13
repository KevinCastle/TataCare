'use client';

import FormModal from '@/app/components/formModal';
import { useContactStore, useElderStore } from '@/app/store';
import {
  MapPinSimple,
  Phone,
  Siren,
} from '@phosphor-icons/react/dist/ssr';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Card from '@/app/components/card';

function Page() {
  const pathname = usePathname();
  const elderId = pathname.split('/')[2];

  const { getElder, selectedElder: elder } = useElderStore((state) => ({
    getElder: state.getElder,
    selectedElder: state.selectedElder,
  }));

  const { getContacts, contacts } = useContactStore((state) => ({
    getContacts: state.get,
    contacts: state.contacts,
  }));

  useEffect(() => {
    if (elderId) {
      if (!elder && elderId) {
        getElder(elderId);
      }
      if (elder) {
        getContacts(elderId);
      }
    }
  }, [elder, elderId, getElder, getContacts]);

  return (
    <main className="h-[calc(100vh-64px)] lg:h-[calc(100vh-32px)] 2xl:h-[calc(100vh-64px)] px-4 md:px-8 relative">
      <header className="flex justify-between mb-4 pt-10">
        <div className="flex items-center">
          <Siren color="#006FEE" className="text-xl lg:text-3xl mr-[2px] lg:mr-2" />
          <p className="text-base lg:text-2xl font-medium">
            Contactos
            <span className="hidden lg:inline"> de emergencia</span>
          </p>
        </div>
        <FormModal type="contact" />
      </header>
      {contacts.length === 0 ? (
        <div className="flex justify-center items-center w-full h-[calc(100%-96px)]">
          <p className="text-xl text-center">Aún no tiene contactos registrados</p>
        </div>
      ) : (
        <article className="grid grid-cols-2 gap-4 pb-10">
          {contacts.map((contact) => (
            <section className="col-span-2 md:col-span-1" key={contact.id}>
              <Card
                title={contact.role}
                type="contact"
                edit
                remove
                like
                id={contact.id}
                className="h-auto mt-2 lg:mt-4"
              >
                <div className="grid grid-cols-1 gap-y-3">
                  <div className="col-span-1">
                    <p className="font-medium text-zinc-600">Nombre</p>
                    <p className="text-lg font-medium text-zinc-900 text-pretty">{contact.name}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-medium text-zinc-600">Dirección</p>
                    <div className="flex gap-1">
                      <MapPinSimple size={20} color="#006FEE" className="mt-1" />
                      <p className="text-lg font-medium text-zinc-900 text-pretty ms-1">{contact.address}</p>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <p className="font-medium text-zinc-600">Teléfono</p>
                    <div className="flex gap-1">
                      <Phone size={20} color="#006FEE" className="mt-1" />
                      <p className="text-lg font-medium text-zinc-900 text-pretty ms-1">{contact.phone}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </section>
          ))}
        </article>
      )}
    </main>
  );
}

export default Page;
