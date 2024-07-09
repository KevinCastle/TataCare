'use client';

import {
  Button,
  Input, ModalBody, ModalContent, ModalFooter, ModalHeader,
  Select,
  Selection,
  SelectItem,
} from '@nextui-org/react';
import {
  MutableRefObject, useEffect, useRef, useState,
} from 'react';
import { v4 } from 'uuid';
import {
  useAllergyStore, useDiseaseStore, useElderStore,
} from '../store';

interface ConditionFormProps {
    id?: string;
}

export default function ConditionForm({ id }: ConditionFormProps) {
  const [name, setName] = useState<string>('');
  const [detail, setDetail] = useState<string>('');
  const [conditionType, setConditionType] = useState<Selection>(new Set([]));
  const [error, setError] = useState<string>('');
  const onCloseRef: MutableRefObject<(() => void) | null> = useRef<(() => void) | null>(null);

  const { selectedElder: elder } = useElderStore((state) => ({
    selectedElder: state.selectedElder,
  }));

  const {
    getDiseases, editDisease, addDisease, diseases,
  } = useDiseaseStore((state) => ({
    getDiseases: state.get,
    addDisease: state.add,
    editDisease: state.edit,
    diseases: state.diseases,
  }));

  const {
    getAllergies, editAllergy, addAllergy, allergies,
  } = useAllergyStore((state) => ({
    getAllergies: state.get,
    addAllergy: state.add,
    editAllergy: state.edit,
    allergies: state.allergies,
  }));

  const conditionTypes: { id: string; name: string }[] = [
    { id: 'disease', name: 'Enfermedad' },
    { id: 'allergy', name: 'Alergia' },
  ];

  function validateForm() {
    if (!name.trim()) {
      setError('El nombre es requerido.');
      return false;
    }
    if (!detail.trim()) {
      setError('El detalle es requerido.');
      return false;
    }
    if (Array.from(conditionType)[0] as string === '') {
      setError('El tipo de condición es requerido.');
      return false;
    }
    return true;
  }

  const submitForm = () => {
    if (!validateForm()) {
      return;
    }
    if (elder) {
      const conditionModified = {
        id: '',
        elder_id: elder.id,
        name,
        detail,
      };

      if (Array.from(conditionType)[0] as string === 'disease') {
        if (id) {
          conditionModified.id = id;
          editDisease(conditionModified);
        } else {
          conditionModified.id = v4();
          addDisease(conditionModified);
        }
      }
      if (Array.from(conditionType)[0] as string === 'allergy') {
        if (id) {
          conditionModified.id = id;
          editAllergy(conditionModified);
        } else {
          conditionModified.id = v4();
          addAllergy(conditionModified);
        }
      }
      if (onCloseRef.current) {
        onCloseRef.current();
      }
    }
  };

  useEffect(() => {
    if (elder && !diseases) {
      getDiseases(elder.id);
    }
    if (elder && !allergies) {
      getAllergies(elder.id);
    }

    if (id && diseases) {
      const disease = diseases.find((disease) => disease.id === id);
      if (disease) {
        setName(disease.name);
        setDetail(disease.detail);
        setConditionType(new Set(['disease']));
      } else if (allergies) {
        const allergy = allergies.find((allergy) => allergy.id === id);
        if (allergy) {
          setName(allergy.name);
          setDetail(allergy.detail);
          setConditionType(new Set(['allergy']));
        }
      }
    }
  }, [id, elder, getDiseases, diseases, getAllergies, allergies]);

  return (
    (
      <ModalContent>
        {(onClose) => {
          onCloseRef.current = onClose;
          return (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {
                // eslint-disable-next-line no-nested-ternary
                  Array.from(conditionType)[0] as string === 'disease' && diseases.find((disease) => disease.id === id) ? 'Editar enfermedad'
                    : Array.from(conditionType)[0] as string === 'allergy' && allergies.find((allergy) => allergy.id === id) ? 'Editar alergia'
                      : 'Agregar condición'
                }
              </ModalHeader>
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
                  <Input
                    isRequired
                    type="text"
                    label="Detalle de la condición"
                    placeholder="Introduzca el detalle"
                    value={detail}
                    onValueChange={setDetail}
                  />
                  <Select
                    label="Tipo de condición"
                    selectedKeys={conditionType}
                    onSelectionChange={setConditionType}
                  >
                    {conditionTypes.map((type) => (
                      <SelectItem key={type.id}>
                        {type.name}
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
                <Button color="primary" onPress={() => { submitForm(); }}>
                  {id ? 'Guardar cambios' : 'Agregar'}
                </Button>
              </ModalFooter>
            </>
          );
        }}
      </ModalContent>

    )
  );
}
