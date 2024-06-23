'use client';

import {
  Button,
  DatePicker, Input, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem,
  Selection,
} from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { DateValue, parseDate } from '@internationalized/date';
import { v4 } from 'uuid';
import { useDiseaseStore, useElderStore, useMedicationStore } from '../store';
import { Medication } from '../api/medications/types';

interface MedicationFormProps {
    id?: string;
}

export default function MedicationForm({ id }: MedicationFormProps) {
  const { selectedElder: elder } = useElderStore((state) => ({
    selectedElder: state.selectedElder,
  }));
  const [name, setName] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [weight, setWeight] = useState<Selection>(new Set([]));
  const [schedule, setSchedule] = useState<string>('');
  const [pharmacy, setPharmacy] = useState<string>('');
  const [initialDate, setInitialDate] = useState<DateValue | null>(null);
  const [endDate, setEndDate] = useState<DateValue | null>(null);
  const [diseaseId, setDiseaseId] = useState<Selection>(new Set([]));
  const [favorite, setFavorite] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const medicationWeightTypes: string[] = [
    'Gramos (g)',
    'Miligramos (mg)',
    'Mililitros (ml)',
    'Centímetros cúbicos (cc)',
  ];

  const {
    getMedications, editMedication, addMedication, medications,
  } = useMedicationStore((state) => ({
    getMedications: state.get,
    addMedication: state.add,
    editMedication: state.edit,
    medications: state.medications,
  }));

  const { getDisease, diseases } = useDiseaseStore((state) => ({
    getDisease: state.get,
    diseases: state.diseases,
  }));

  function validateForm() {
    // Check for empty or null values
    if (!name.trim()) {
      setError('El nombre es requerido.');
      return false;
    }
    if (!quantity.trim()) {
      setError('La cantidad y peso es requerida.');
      return false;
    }
    if (Array.from(weight)[0] as string === '') {
      setError('El peso es requerido.');
      return false;
    }
    if (!schedule.trim()) {
      setError('El horario es requerido.');
      return false;
    }
    if (!pharmacy.trim()) {
      setError('La farmacia es requerida.');
      return false;
    }
    if (!initialDate || initialDate.toString().length === 0) {
      setError('La fecha de inicial es requerida.');
      return false;
    }
    if (!endDate || endDate.toString().length === 0) {
      setError('La fecha de término es requerida.');
      return false;
    }
    return true;
  }

  const submitForm = () => {
    if (!validateForm()) return;
    if (elder) {
      const medicationModified = {
        id: '',
        elder_id: elder.id,
        name,
        quantity,
        weight: Array.from(weight)[0] as string,
        schedule,
        pharmacy,
        initial_date: initialDate?.toString() || '',
        end_date: endDate?.toString() || '',
        disease_id: Array.from(diseaseId)[0] as string,
        favorite,
      };

      if (id) {
        medicationModified.id = id;
        editMedication(medicationModified);
      } else {
        medicationModified.id = v4();
        addMedication(medicationModified);
      }
    }
  };

  useEffect(() => {
    if (elder && !medications) {
      getMedications(elder.id);
    }
    if (elder && !diseases) {
      getDisease(elder.id);
    }
    if (id && medications) {
      const medication = medications.find((medication: Medication) => medication.id === id);
      if (medication) {
        setName(medication.name);
        setQuantity(medication.quantity);
        setWeight(new Set([medication.weight]));
        setSchedule(medication.schedule);
        setPharmacy(medication.pharmacy);
        setInitialDate(parseDate(medication.initial_date));
        setEndDate(parseDate(medication.end_date));
        setDiseaseId(new Set([medication.weight]));
        setFavorite(medication.favorite);
      }
    }
  }, [id, elder, getMedications, medications, getDisease, diseases]);

  return (
    (
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{medications.find((medication: Medication) => medication.id === id) ? 'Editar medicina' : 'Registrar medicina'}</ModalHeader>
            <ModalBody>
              <form className="flex flex-col gap-y-5">
                <Input
                  isRequired
                  type="text"
                  label="Nombre"
                  placeholder="Introduzca el nombre"
                  value={name}
                  onValueChange={setName}
                />
                <DatePicker
                  label="Fecha de inicio"
                  isRequired
                  value={initialDate}
                  onChange={setInitialDate}
                />
                <DatePicker
                  label="Fecha de término"
                  isRequired
                  value={endDate}
                  onChange={setEndDate}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    className="col-span-1"
                    isRequired
                    type="number"
                    label="Cantidad"
                    placeholder="Introduzca la cantidad"
                    value={quantity}
                    onValueChange={setQuantity}
                  />
                  <Select
                    className="col-span-1"
                    isRequired
                    label="Peso"
                    selectedKeys={weight}
                    onSelectionChange={setWeight}
                  >
                    {medicationWeightTypes.map((weight) => (
                      <SelectItem key={weight}>
                        {weight}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input
                    className="col-span-2"
                    isRequired
                    type="number"
                    label="Cada cuantas horas"
                    placeholder="Introduzca un número"
                    value={schedule}
                    onValueChange={setSchedule}
                  />
                </div>
                <Select
                  isRequired
                  label="Recetado por"
                  selectedKeys={diseaseId}
                  onSelectionChange={setDiseaseId}
                >
                  {diseases.map((disease) => (
                    <SelectItem key={disease.id}>
                      {disease.name}
                    </SelectItem>
                  ))}
                </Select>
              </form>
            </ModalBody>
            <ModalFooter>
              {error && (<p>{error}</p>)}
              <Button color="danger" variant="light" onPress={onClose}>
                Atrás
              </Button>
              <Button color="primary" onPress={() => { submitForm(); onClose(); }}>
                {id ? 'Guardar cambios' : 'Registrar'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>

    )
  );
}
