'use client';

import {
  Avatar,
  Button,
  Checkbox,
  CheckboxGroup,
  DatePicker, Input, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem,
} from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { bloodTypes } from '../utils';
import { previsions } from '../utils/PrevisionsUtils';
import { useElderStore } from '../store';

export default function ElderForm({ elderId }: { elderId: string}) {
  const [countries, setCountries] = useState<Record<string, string>>({});
  const genres = [
    {
      key: 'masculino',
      label: 'Masculino',
    },
    {
      key: 'femenino',
      label: 'Femenino',
    },
  ];

  const { getElder, editElder, selectedElder: elder } = useElderStore((state) => ({
    getElder: state.getElder,
    editElder: state.edit,
    selectedElder: state.selectedElder,
  }));

  useEffect(() => {
    getElder(elderId);
    const fetchData = async () => {
      try {
        const response = await fetch('https://flagcdn.com/es/codes.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        throw new Error('Failed to fetch countries.');
      }
    };

    fetchData();
  }, []);

  if (!elder) return null;
  return (
    (
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">¿Está seguro?</ModalHeader>
            <ModalBody>
              <form className="flex flex-col gap-y-5">
                <Input
                  isRequired
                  type="text"
                  label="Nombre"
                  placeholder="Introduzca el nombre"
                />
                <Input
                  isRequired
                  type="text"
                  label="Apellido"
                  placeholder="Introduzca el apellido"
                />
                <DatePicker
                  label="Fecha de nacimiento"
                  isRequired
                  showMonthAndYearPickers
                />
                <Select
                  isRequired
                  label="Sexo"
                >
                  {genres.map((genre) => (
                    <SelectItem key={genre.key}>
                      {genre.label}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  isRequired
                  label="Tipo de sangre"
                >
                  {bloodTypes.map((bloodType) => (
                    <SelectItem key={bloodType}>
                      {bloodType}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  isRequired
                  label="Nacionalidad"
                >
                  {Object.entries(countries).map(([code, name]) => (
                    <SelectItem
                      key={code}
                      startContent={<Avatar alt={name} className="w-6 h-6" src={`https://flagcdn.com/${code}.svg`} />}
                    >
                      {name}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  isRequired
                  type="text"
                  label="Número de identidad"
                  placeholder="Introduzca el rut con puntos y guión"
                />
                <Select
                  isRequired
                  label="Previsión de salud"
                >
                  {previsions.map((prevision) => (
                    <SelectItem key={prevision.id}>
                      {prevision.name}
                    </SelectItem>
                  ))}
                </Select>
                <CheckboxGroup
                  label="Selecciona las siguientes condiciones que tenga presente"
                >
                  <Checkbox value="diabetic">Diabetes</Checkbox>
                  <Checkbox value="hypertensive">Hipertensión</Checkbox>
                  <Checkbox value="urinary_incontinence">Incontinencia urinaria</Checkbox>
                  <Checkbox value="kidney_failure">problemas renales</Checkbox>
                </CheckboxGroup>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Atrás
              </Button>
              <Button color="primary" onPress={() => editElder(elderId, elder)}>
                Guardar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>

    )
  );
}
