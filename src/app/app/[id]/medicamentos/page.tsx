'use client';

import { useDiseaseStore, useElderStore, useMedicationStore } from '@/app/store';
import { Pill, Prescription, Storefront } from '@phosphor-icons/react/dist/ssr';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Card from '@/app/components/card';
import { calculateRemainingTime, shortDate } from '@/app/utils';
import FormModal from '@/app/components/formModal';

function Page() {
  const pathname = usePathname();
  const elderId = pathname.split('/')[2];
  const { getElder, selectedElder: elder } = useElderStore((state) => ({
    getElder: state.getElder,
    selectedElder: state.selectedElder,
  }));

  const { getMedications, medications } = useMedicationStore((state) => ({
    getMedications: state.get,
    medications: state.medications,
  }));

  const { getDisease, diseases } = useDiseaseStore((state) => ({
    getDisease: state.get,
    diseases: state.diseases,
  }));

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  };

  const getDiseaseName = (diseaseId: string) => {
    const disease = diseases.find((d) => d.id === diseaseId);
    return disease ? disease.name : '';
  };

  useEffect(() => {
    if (elderId) {
      if (!elder && elderId) {
        getElder(elderId);
      }
      if (elder && medications.length === 0) {
        getMedications(elderId);
      }
      if (elder && diseases.length === 0) {
        getDisease(elder.id);
      }
    }
  }, [elder, elderId, getElder, getMedications, getDisease, diseases, medications]);

  return (
    <main className="h-[calc(100vh-64px)] lg:h-[calc(100vh-32px)] 2xl:h-[calc(100vh-64px)] px-4 md:px-8 relative">
      <header className="flex justify-between mb-4 pt-10">
        <div className="flex items-center">
          <Pill color="#006FEE" size={32} className="mr-2" />
          <p className="text-2xl font-medium">Medicamentos</p>
        </div>
        <FormModal type="medication" />
      </header>
      {medications.length === 0 ? (
        <p>No tiene medicinas registradas</p>
      ) : (
        <article className="grid grid-cols-2 gap-4">
          {medications.map((medication) => (
            <section key={medication.id} className="col-span-2 lg:col-span-1">
              <Card title={medication.name} type="medication" edit remove like id={medication.id}>
                <div className="grid grid-cols-3 gap-y-3">
                  <div className="col-span-1">
                    <p className="font-medium text-zinc-600">Inicio</p>
                    <p className="text-lg font-medium text-zinc-900 text-pretty ms-1">{shortDate(medication.initial_date)}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-medium text-zinc-600">Fin</p>
                    <p className="text-lg font-medium text-zinc-900 text-pretty ms-1">{shortDate(medication.end_date)}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-medium text-zinc-600">Restante</p>
                    <p className="text-lg font-medium text-zinc-900 text-pretty ms-1">{calculateRemainingTime(getTodayDate(), medication.end_date)}</p>
                  </div>
                  <div className="col-span-3">
                    <p className="font-medium text-zinc-600">Dosis</p>
                    <p className="text-lg font-medium text-zinc-900 text-pretty ms-1">{`${medication.quantity} ${medication.weight} cada ${medication.schedule} horas`}</p>
                  </div>
                  <div className="col-span-3 grid grid-cols-2">
                    <div className="col-span-1">
                      <p className="font-medium text-zinc-600">Recetado por</p>
                      <div className="flex gap-1">
                        <Prescription size={20} color="#C20E4D" className="mt-1" weight="bold" />
                        <p className="text-lg font-medium text-zinc-900 text-pretty ms-1">{getDiseaseName(medication.disease_id)}</p>
                      </div>
                    </div>
                    <div className="col-span-1">
                      <p className="font-medium text-zinc-600">Farmacia donde comprar</p>
                      <div className="flex gap-1">
                        <Storefront size={20} color="#C20E4D" className="mt-1" weight="bold" />
                        <p className="text-lg font-medium text-zinc-900 text-pretty ms-1">{medication.pharmacy}</p>
                      </div>
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
