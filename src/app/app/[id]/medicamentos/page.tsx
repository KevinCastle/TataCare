'use client';

import {
  useAllergyStore, useDiseaseStore, useElderStore, useMedicationStore,
} from '@/app/store';
import {
  Pill, Prescription, Storefront, Virus,
} from '@phosphor-icons/react/dist/ssr';
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

  const { getDiseases, diseases } = useDiseaseStore((state) => ({
    getDiseases: state.get,
    diseases: state.diseases,
  }));

  const { getAllergies, allergies } = useAllergyStore((state) => ({
    getAllergies: state.get,
    allergies: state.allergies,
  }));

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  };

  const getConditions = (diseaseId: string) => {
    const conditions = [...diseases.map((disease) => ({ ...disease, type: 'disease' })),
      ...allergies.map((allergy) => ({ ...allergy, type: 'allergy' }))];
    const condition = conditions.find((condition) => condition.id === diseaseId);
    return condition ? { name: condition.name, type: condition.type } : { name: '', type: '' };
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
        getDiseases(elder.id);
      }
      if (elder && allergies.length === 0) {
        getAllergies(elder.id);
      }
    }
  }, [elder, elderId, getElder, getMedications, getDiseases, diseases, medications, getAllergies, allergies]);

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
        <div className="flex justify-center items-center w-full h-[calc(100%-96px)]">
          <p className="text-xl">Aún no tiene medicamentos registrados</p>
        </div>
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
                      <p className="font-medium text-zinc-600">Farmacia donde comprar</p>
                      <div className="flex gap-1">
                        <Storefront size={20} color="#C20E4D" className="mt-1" weight="bold" />
                        <p className="text-lg font-medium text-zinc-900 text-pretty ms-1">{medication.pharmacy}</p>
                      </div>
                    </div>
                    {medication.disease_id && (
                      <div className="col-span-1">
                        <p className="font-medium text-zinc-600">Recetado para</p>
                        <div className="flex gap-1">
                          {getConditions(medication.disease_id).type === 'allergy' ? (
                            <Virus size={20} color="#0E793C" className="mt-1" weight="bold" />
                          ) : (
                            <Prescription size={20} color="#C20E4D" className="mt-1" weight="bold" />
                          )}
                          <p className="text-lg font-medium text-zinc-900 text-pretty ms-1">{getConditions(medication.disease_id).name}</p>
                        </div>
                      </div>
                    )}
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
