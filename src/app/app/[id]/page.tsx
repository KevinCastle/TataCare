'use client';

import {
  Ambulance,
  Cake, CalendarDot, Drop, FirstAid, Flag, GenderMale, Heart, Heartbeat, IdentificationCard,
  Phone,
  Pill,
  SealWarning,
  UserSquare,
  Virus,
  MapPinSimple,
  Prescription,
} from '@phosphor-icons/react/dist/ssr';
import { useElderStore } from '@/app/store/elderStore';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { getBloodTypeCompatibility, getAge, getBirthdate } from '@/app/utils';
import { useAllergyStore } from '@/app/store/allergyStore';
import Card from '../../components/card';

function Page() {
  const pathname = usePathname();
  const elderId = pathname.split('/').pop();
  const { getElder, selectedElder: elder } = useElderStore((state) => ({
    getElder: state.getElder,
    selectedElder: state.selectedElder,
  }));

  const { getAllergies, allergies } = useAllergyStore((state) => ({
    getAllergies: state.get,
    allergies: state.allergies,
  }));

  useEffect(() => {
    if (!elder && elderId) {
      getElder(elderId);
      getAllergies(elderId);
    }
  }, [elder, elderId, getElder, getAllergies]);

  return (
    <>
      <header className="flex items-center mb-4">
        <IdentificationCard color="#006FEE" size={32} className="mr-2" />
        <p className="text-2xl font-medium">Ficha</p>
      </header>
      {!elder && <p>Cargando...</p>}
      {elder && (
      <article className="grid grid-cols-12 grid-rows-2 gap-4">
        <section id="personal-data" className="col-span-7 row-span-1">
          <Card
            avatar="https://i.pravatar.cc/150?u=a042581f4e29026024d"
            title={`${elder.name} ${elder.surname}`}
          >
            <div className="grid grid-cols-2 grid-rows-3 gap-5">
              <div id="sex" className="col-span-2 row-span-1">
                <p className="font-medium text-zinc-600">Sexo</p>
                <div className="flex items-center">
                  <GenderMale size={20} color="#006FEE" />
                  <p className="text-lg font-medium text-zinc-900 ms-1">{elder.sex}</p>
                </div>
              </div>
              <div id="birthdate" className="col-span-1 row-span-1">
                <p className="font-medium text-zinc-600">Fecha de Nacimiento</p>
                <div className="flex items-center">
                  <CalendarDot size={20} color="#006FEE" />
                  <p className="text-lg font-medium text-zinc-900 ms-1">{getBirthdate(elder.birthdate)}</p>
                </div>
              </div>
              <div id="age" className="col-span-1 row-span-1">
                <p className="font-medium text-zinc-600">Edad</p>
                <div className="flex items-center">
                  <Cake size={20} color="#006FEE" />
                  <p className="text-lg font-medium text-zinc-900 ms-1">{`${getAge(elder.birthdate)} años`}</p>
                </div>
              </div>
              <div id="blood-type" className="col-span-1 row-span-1">
                <p className="font-medium text-zinc-600">Tipo de Sangre</p>
                <div className="flex items-center">
                  <Drop size={20} color="#F31260" />
                  <p className="text-lg font-medium text-zinc-900 ms-1">{`Sangre ${elder.blood_type}`}</p>
                </div>
              </div>
              <div id="bood-donation" className="col-span-1 row-span-1">
                <p className="font-medium text-zinc-600">Puede recibir donación</p>
                <div className="flex items-center">
                  <Heart size={20} color="#F31260" />
                  <p className="text-lg font-medium text-zinc-900 ms-1">{getBloodTypeCompatibility(elder.blood_type)}</p>
                </div>
              </div>
            </div>
          </Card>
        </section>
        <section id="health-data" className="col-span-5 row-span-2">
          <Card
            title="Detalles de Salud"
            icon={<Heartbeat size={32} weight="bold" color="#F31260" />}
          >
            <div id="diagnosis">
              <p className="font-medium text-zinc-600">Diagnóstico</p>
              <div className="flex gap-1 mb-5">
                <Prescription size={20} color="#C20E4D" className="mt-1" />
                <div>
                  <p className="text-lg font-medium text-zinc-900">Linfoma de Hodkins</p>
                  <p className="text-lg font-medium text-zinc-900">Diabetes</p>
                  <p className="text-lg font-medium text-zinc-900">Hipertensión</p>
                </div>
              </div>
            </div>
            <div id="medicines">
              <p className="font-medium text-zinc-600">Medicamentos</p>
              <div className="flex gap-1 mb-5">
                <Pill size={20} color="#006FEE" className="mt-1" />
                <div>
                  <p className="text-lg font-medium text-zinc-900">Metformina</p>
                  <p className="text-lg font-medium text-zinc-900">Sulfonilureas</p>
                </div>
              </div>
            </div>
            <div id="allergies">
              <p className="font-medium text-zinc-600">Alergias</p>
              <div className="flex gap-1 mb-5">
                <Virus size={20} color="#0E793C" className="mt-1" />
                <div>
                  {allergies && allergies.length > 0 ? (
                    allergies.map((allergy) => (
                      <p key={allergy.id} className="text-lg font-medium text-zinc-900">{allergy.detail}</p>
                    ))
                  ) : (
                    <p className="text-lg font-medium text-zinc-900">No tiene alergias registradas</p>
                  )}
                </div>
              </div>
            </div>
            <div id="conditions">
              <p className="font-medium text-zinc-600">Condiciones que presenta</p>
              <div className="flex gap-1 mb-5">
                <SealWarning size={20} color="#F5A524" className="mt-1" />
                <div>
                  <p className="text-lg font-medium text-zinc-900">Hipertensión</p>
                  <p className="text-lg font-medium text-zinc-900">Diabetes</p>
                </div>
              </div>
            </div>
            <div id="not-conditions">
              <p className="font-medium text-zinc-600">Condiciones que NO presenta</p>
              <div className="flex gap-1 mb-5">
                <FirstAid size={20} color="#17C964" className="mt-1" />
                <div>
                  <p className="text-lg font-medium text-zinc-900">Problemas renales</p>
                  <p className="text-lg font-medium text-zinc-900">Incontinencia urinaria</p>
                </div>
              </div>
            </div>
          </Card>
        </section>
        <div className="col-span-7 row-span-1 grid grid-cols-2 gap-x-4">
          <section id="legal-data" className="col-span-1">
            <Card
              title="Información Legal"
              icon={<Heartbeat size={32} weight="bold" color="#F31260" />}
            >
              <div id="nacionality" className="mb-5">
                <p className="font-medium text-zinc-600">Nacionalidad</p>
                <div className="flex items-center">
                  <Flag size={20} color="#006FEE" />
                  <p className="text-lg font-medium text-zinc-900 ms-1">Chileno</p>
                </div>
              </div>
              <div id="identification" className="mb-5">
                <p className="font-medium text-zinc-600">Identificación</p>
                <div className="flex items-center">
                  <IdentificationCard size={20} color="#006FEE" />
                  <p className="text-lg font-medium text-zinc-900 ms-1">11.111.111-1</p>
                </div>
              </div>
              <div id="insurance" className="mb-5">
                <p className="font-medium text-zinc-600">Previsión</p>
                <div className="flex items-center">
                  <Ambulance size={20} color="#006FEE" />
                  <p className="text-lg font-medium text-zinc-900 ms-1">Fonasa</p>
                </div>
              </div>
            </Card>
          </section>
          <section id="contact-data" className="col-span-1">
            <Card
              title="Contacto de emergencia"
              icon={<Heartbeat size={32} weight="bold" color="#F31260" />}
            >
              <div id="nacionality" className="mb-5">
                <p className="font-medium text-zinc-600">Doctor</p>
                <div className="flex items-center">
                  <UserSquare size={20} color="#006FEE" />
                  <p className="text-lg font-medium text-zinc-900 ms-1">María Lourdes Pereira</p>
                </div>
              </div>
              <div id="identification" className="mb-5">
                <p className="font-medium text-zinc-600">Contacto</p>
                <div className="flex items-center">
                  <Phone size={20} color="#006FEE" />
                  <p className="text-lg font-medium text-zinc-900 ms-1">+56 9 1234 5678</p>
                </div>
              </div>
              <div id="prevision" className="mb-5">
                <p className="font-medium text-zinc-600">Dirección</p>
                <div className="flex items-center">
                  <MapPinSimple size={20} color="#006FEE" />
                  <p className="text-lg font-medium text-zinc-900 ms-1">Av. Nueva Lyon 7777</p>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </article>
      )}
    </>
  );
}

export default Page;
