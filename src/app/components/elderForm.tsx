'use client';

import {
  Avatar,
  Button,
  Checkbox,
  CheckboxGroup,
  DatePicker, Input, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem,
  Selection,
} from '@nextui-org/react';
import {
  MutableRefObject, useEffect, useRef, useState,
} from 'react';
import { DateValue, parseDate } from '@internationalized/date';
import { v4 } from 'uuid';
import { PutBlobResult } from '@vercel/blob';
import { bloodTypes } from '../utils';
import { previsions } from '../utils/PrevisionsUtils';
import { useElderStore } from '../store';

interface ElderFormProps {
  elderId?: string;
}

export default function ElderForm({ elderId }: ElderFormProps) {
  const [name, setName] = useState<string>('');
  const [surName, setSurName] = useState<string>('');
  const [birthDate, setBirthDate] = useState<DateValue | null>(null);
  const [genre, setGenre] = useState<Selection>(new Set([]));
  const [bloodType, setBloodType] = useState<Selection>(new Set([]));
  const [nationality, setNationality] = useState<Selection>(new Set([]));
  const [identityNumber, setIdentityNumber] = useState<string>('');
  const [healthPrevision, setHealthPrevision] = useState<Selection>(new Set([]));
  const [conditions, setConditions] = useState<string[]>([]);
  const [countries, setCountries] = useState<Selection>(new Set([]));
  const [error, setError] = useState<string>('');
  const onCloseRef: MutableRefObject<(() => void) | null> = useRef<(() => void) | null>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [favoriteContact, setFavoriteContact] = useState<string>('');
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

  const {
    getElder, editElder, addElder, selectedElder: elder, uploadImage,
  } = useElderStore((state) => ({
    getElder: state.getElder,
    addElder: state.add,
    editElder: state.edit,
    selectedElder: state.selectedElder,
    uploadImage: state.uploadImage,
  }));

  function validateForm() {
    if (!name.trim()) {
      setError('El nombre es requerido.');
      return false;
    }
    if (!surName.trim()) {
      setError('El apellido es requerido.');
      return false;
    }
    if (!birthDate || birthDate.toString().length === 0) {
      setError('La fecha de nacimiento es requerida.');
      return false;
    }
    if (Array.from(genre)[0] as string === '') {
      setError('El sexo es requerido.');
      return false;
    }
    if (Array.from(bloodType)[0] as string === '') {
      setError('El tipo de sangre es requerido.');
      return false;
    }
    if (Array.from(nationality)[0] as string === '') {
      setError('La nacionalidad es requerida.');
      return false;
    }
    if (!identityNumber.trim()) {
      setError('El número de identidad es requerido.');
      return false;
    }
    if (Array.from(healthPrevision)[0] as string === '') {
      setError('La previsión de salud es requerida.');
      return false;
    }

    return true;
  }

  const handleUploadImage = async () => {
    if (!inputFileRef.current?.files) {
      throw new Error('No file selected');
    }

    const file = inputFileRef.current.files[0];

    const blob = await uploadImage(file);
    setBlob(blob);
  };

  const submitForm = () => {
    if (!validateForm()) return;
    const elderModified = {
      id: '',
      name,
      surname: surName,
      sex: Array.from(genre)[0] as string,
      blood_type: Array.from(bloodType)[0] as string,
      insurance: Array.from(healthPrevision)[0] as string,
      diabetic: conditions.includes('diabetic'),
      hypertensive: conditions.includes('hypertensive'),
      birthdate: birthDate?.toString() || '',
      nationality: Array.from(nationality)[0] as string,
      identification_number: identityNumber,
      kidney_failure: conditions.includes('kidney_failure'),
      urinary_incontinence: conditions.includes('urinary_incontinence'),
      avatar: blob?.url || Array.from(genre)[0] === 'Femenino' ? 'https://qjsik5ugffyu4v6q.public.blob.vercel-storage.com/9720030-xoT9NQMadRvcvQqunsJPuQCPXXmhat.jpg' : 'https://qjsik5ugffyu4v6q.public.blob.vercel-storage.com/9334225-9VwqupjXfrtxYSFZh7tggrr1IsR8oI.jpg',
      favorite_contact: favoriteContact,
    };

    if (elder) {
      elderModified.id = elder.id;
      editElder(elder.id, elderModified);
    } else {
      elderModified.id = v4();
      addElder(elderModified);
    }
    if (onCloseRef.current) {
      onCloseRef.current();
    }
  };

  useEffect(() => {
    if (elderId && !elder) {
      getElder(elderId);
    }
    if (elder) {
      setName(elder.name);
      setSurName(elder.surname);
      setBirthDate(parseDate(elder.birthdate.split('T')[0]));
      setGenre(new Set([elder.sex]));
      setBloodType(new Set([elder.blood_type]));
      setNationality(new Set([elder.nationality]));
      setIdentityNumber(elder.identification_number);
      setHealthPrevision(new Set([elder.insurance]));
      setFavoriteContact(elder.favorite_contact);
      const conditions = [
        { label: 'diabetic', is_presented: elder.diabetic },
        { label: 'hypertensive', is_presented: elder.hypertensive },
        { label: 'kidney_failure', is_presented: elder.kidney_failure },
        { label: 'urinary_incontinence', is_presented: elder.urinary_incontinence },
      ];
      const conditionsPresented = conditions.reduce((acc, condition) => {
        if (condition.is_presented) acc.push(condition.label);
        return acc;
      }, [] as string[]);
      setConditions(conditionsPresented as string[]);
    }
    if (!countries || Object.keys(countries).length === 0) {
      const fetchCountries = async () => {
        try {
          const response = await fetch('https://flagcdn.com/es/codes.json');
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const countries = await response.json();

          setCountries(countries);
        } catch (error) {
          throw new Error('Failed to fetch countries.');
        }
      };
      fetchCountries();
    }
  }, [elderId, getElder, elder, countries]);

  return (
    (
      <ModalContent>
        {(onClose) => {
          onCloseRef.current = onClose;
          return (
            <>
              <ModalHeader className="flex flex-col gap-1">{elder ? 'Editar abuelito' : 'Registrar abuelito'}</ModalHeader>
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
                    label="Apellido"
                    placeholder="Introduzca el apellido"
                    value={surName}
                    onValueChange={setSurName}
                  />
                  <DatePicker
                    label="Fecha de nacimiento"
                    isRequired
                    showMonthAndYearPickers
                    value={birthDate}
                    onChange={setBirthDate}
                  />
                  <Select
                    isRequired
                    label="Sexo"
                    selectedKeys={genre}
                    onSelectionChange={setGenre}
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
                    selectedKeys={bloodType}
                    onSelectionChange={setBloodType}
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
                    selectedKeys={nationality}
                    onSelectionChange={setNationality}
                  >
                    {Object.entries(countries).map(([code, name]) => (
                      <SelectItem
                        key={name}
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
                    value={identityNumber}
                    onValueChange={setIdentityNumber}
                  />
                  <Select
                    isRequired
                    label="Previsión de salud"
                    selectedKeys={healthPrevision}
                    onSelectionChange={setHealthPrevision}
                  >
                    {previsions.map((prevision) => (
                      <SelectItem key={prevision.id}>
                        {prevision.name}
                      </SelectItem>
                    ))}
                  </Select>
                  <CheckboxGroup
                    label="Selecciona las siguientes condiciones que tenga presente"
                    value={conditions}
                    onValueChange={setConditions}
                  >
                    <Checkbox value="diabetic">Diabetes</Checkbox>
                    <Checkbox value="hypertensive">Hipertensión</Checkbox>
                    <Checkbox value="urinary_incontinence">Incontinencia urinaria</Checkbox>
                    <Checkbox value="kidney_failure">problemas renales</Checkbox>
                  </CheckboxGroup>
                  <div className="">
                    <p className="text-medium text-foreground-500 mb-1">Sube una foto de perfil para la ficha</p>
                    <div className="hiddenflex w-full items-center justify-between space-x-4 p-2 border-2  hover:border-gray-400 rounded-xl transition-colors duration-300">
                      <input onChange={handleUploadImage} ref={inputFileRef} type="file" name="image" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100" />
                    </div>
                  </div>
                </form>
              </ModalBody>
              <ModalFooter>
                {error && (<p>{error}</p>)}
                <Button color="danger" variant="light" onPress={onClose}>
                  Atrás
                </Button>
                <Button color="primary" onPress={() => { submitForm(); onClose(); }}>
                  {elderId && elder ? 'Guardar cambios' : 'Registrar'}
                </Button>
              </ModalFooter>
            </>
          );
        }}
      </ModalContent>

    )
  );
}
