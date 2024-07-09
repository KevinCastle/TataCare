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
import { useElderStore, useTasteStore } from '../store';

interface TasteFormProps {
    id?: string;
}

export default function TasteForm({ id }: TasteFormProps) {
  const [detail, setDetail] = useState<string>('');
  const [tasteType, setTasteType] = useState<Selection>(new Set([]));
  const [error, setError] = useState<string>('');
  const onCloseRef: MutableRefObject<(() => void) | null> = useRef<(() => void) | null>(null);
  const tasteTypes: { id: string; name: string }[] = [
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

  const { selectedElder: elder } = useElderStore((state) => ({
    selectedElder: state.selectedElder,
  }));

  const {
    getTastes, editTaste, addTaste, tastes,
  } = useTasteStore((state) => ({
    getTastes: state.get,
    addTaste: state.add,
    editTaste: state.edit,
    tastes: state.tastes,
  }));

  function validateForm() {
    if (!detail.trim()) {
      setError('El detalle es requerido.');
      return false;
    }
    if (Array.from(tasteType)[0] as string === '') {
      setError('El tipo de gusto es requerido.');
      return false;
    }
    return true;
  }

  const submitForm = () => {
    if (!validateForm()) {
      return;
    }

    if (elder) {
      const tasteModified = {
        id: '',
        elder_id: elder.id,
        detail,
        pleasure: Array.from(tasteType)[0] as string === 'pleasure',
        displeasure: Array.from(tasteType)[0] as string === 'displeasure',
        avoid: Array.from(tasteType)[0] as string === 'avoid',
        activity: false,
      };

      if (id) {
        tasteModified.id = id;
        editTaste(tasteModified);
      } else {
        tasteModified.id = v4();
        addTaste(tasteModified);
      }

      if (onCloseRef.current) {
        onCloseRef.current();
      }
    }
  };

  useEffect(() => {
    if (elder && !tastes) {
      getTastes(elder.id);
    }

    if (id && tastes) {
      const taste = tastes.find((taste) => taste.id === id);
      if (taste) {
        setDetail(taste.detail);
        setTasteType(new Set(['taste']));
        if (taste.pleasure) {
          setTasteType(new Set(['pleasure']));
        } else if (taste.displeasure) {
          setTasteType(new Set(['displeasure']));
        } else if (taste.avoid) {
          setTasteType(new Set(['taste']));
        }
      }
    }
  }, [id, elder, tastes, getTastes]);

  return (
    (
      <ModalContent>
        {(onClose) => {
          onCloseRef.current = onClose;
          return (
            <>
              <ModalHeader className="flex flex-col gap-1">{tastes.find((taste) => taste.id === id) ? 'Editar gusto' : 'Registrar gusto'}</ModalHeader>
              <ModalBody>
                <form className="flex flex-col gap-y-5">
                  <Input
                    isRequired
                    type="text"
                    label="Nombre"
                    placeholder="Introduzca el detalle"
                    value={detail}
                    onValueChange={setDetail}
                  />
                  <Select
                    label="Tipo de gusto"
                    selectedKeys={tasteType}
                    onSelectionChange={setTasteType}
                  >
                    {tasteTypes.map((type) => (
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
