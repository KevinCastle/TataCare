'use client';

import {
  useAllergyStore, useDiseaseStore, useElderStore, useMedicationStore,
} from '@/app/store';
import {
  FirstAid, Heartbeat, Prescription, Virus,
} from '@phosphor-icons/react/dist/ssr';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Card from '@/app/components/card';
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

    type ConditionType = 'disease' | 'allergy';
    interface Condition {
        id: string;
        elder_id: string;
        name: string;
        detail: string;
        type: ConditionType;
    }

    const getConditions = () => {
      const conditions: Condition[] = [...diseases.map((disease) => ({ ...disease, type: 'disease' as ConditionType })),
        ...allergies.map((allergy) => ({ ...allergy, type: 'allergy' as ConditionType }))];

      return conditions.sort((a, b) => a.name.localeCompare(b.name));
    };

    useEffect(() => {
      if (elderId) {
        if (!elder && elderId) {
          getElder(elderId);
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
            <Heartbeat color="#006FEE" className="text-xl lg:text-3xl mr-[2px] lg:mr-2" />
            <p className="text-base lg:text-2xl font-medium">
              Condiciones
              <span className="hidden lg:inline"> de Salud</span>
            </p>
          </div>
          <FormModal type="condition" />
        </header>
        {diseases.length === 0 && allergies.length === 0 ? (
          <div className="flex justify-center items-center w-full h-[calc(100%-96px)]">
            <p className="text-xl text-center">Aún no tiene condiciones de salud registradas</p>
          </div>
        ) : (
          <article className="grid grid-cols-2 gap-4 pb-10">
            {getConditions().map((condition) => (
              <section key={condition.id} className="col-span-2 lg:col-span-1">
                <Card
                  title={condition.name}
                  type="condition"
                  edit
                  remove
                  id={condition.id}
                  icon={condition.type === 'disease' ? <Prescription size={24} color="#C20E4D" /> : <Virus size={24} color="#0E793C" />}
                >
                  <div className="mb-3">
                    <p className="font-medium text-zinc-600">Detalle</p>
                    <p className="text-lg font-medium text-zinc-900 text-pretty ms-1">{condition.detail}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-medium text-zinc-600">Medicamentos asociados</p>
                    <div className="flex gap-1">
                      <FirstAid size={20} color="#C20E4D" className="mt-1" weight="bold" />
                      <p className="text-lg font-medium text-zinc-900 text-pretty ms-1">medicina</p>
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
