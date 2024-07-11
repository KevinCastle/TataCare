'use client';

import {
  Button, Input, ModalBody, ModalContent, ModalFooter, ModalHeader,
} from '@nextui-org/react';
import {
  MutableRefObject, useEffect, useRef, useState,
} from 'react';
import { v4 } from 'uuid';
import {
  useContactStore, useElderStore,
} from '../store';

interface ContactFormProps {
    id?: string;
}

export default function ContactForm({ id }: ContactFormProps) {
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [error, setError] = useState<string>('');
  const onCloseRef: MutableRefObject<(() => void) | null> = useRef<(() => void) | null>(null);

  const { selectedElder: elder } = useElderStore((state) => ({
    selectedElder: state.selectedElder,
  }));

  const {
    getContacts, editContact, addContact, contacts,
  } = useContactStore((state) => ({
    getContacts: state.get,
    addContact: state.add,
    editContact: state.edit,
    contacts: state.contacts,
  }));

  function validateForm() {
    if (!name.trim()) {
      setError('El nombre es requerido.');
      return false;
    }
    if (!phone.trim()) {
      setError('El teléfono es requerido.');
      return false;
    }
    if (!address.trim()) {
      setError('La dirección es requerida.');
      return false;
    }
    return true;
  }

  const submitForm = () => {
    if (!validateForm()) {
      return;
    }
    if (elder) {
      const contactsModified = {
        id: '',
        elder_id: elder.id,
        name,
        phone,
        address,
        role,
      };

      if (id) {
        contactsModified.id = id;
        editContact(contactsModified);
      } else {
        contactsModified.id = v4();
        addContact(contactsModified);
      }
      if (onCloseRef.current) {
        onCloseRef.current();
      }
    }
  };

  useEffect(() => {
    if (elder && !contacts) {
      getContacts(elder.id);
    }

    if (id && contacts) {
      const contact = contacts.find((contact) => contact.id === id);
      if (contact) {
        setName(contact.name);
        setPhone(contact.phone);
        setAddress(contact.address);
        setRole(contact.role);
      }
    }
  }, [id, elder, getContacts, contacts]);

  return (
    (
      <ModalContent>
        {(onClose) => {
          onCloseRef.current = onClose;
          return (
            <>
              <ModalHeader className="flex flex-col gap-1">{contacts.find((contact) => contact.id === id) ? 'Editar contacto' : 'Agregar contacto'}</ModalHeader>
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
                    label="Teléfono"
                    placeholder="Introduzca el teléfono"
                    value={phone}
                    onValueChange={setPhone}
                  />
                  <Input
                    isRequired
                    type="text"
                    label="Dirección"
                    placeholder="Introduzca la dirección"
                    value={address}
                    onValueChange={setAddress}
                  />
                  <Input
                    type="text"
                    label="Relación"
                    placeholder="ejemplo: Hijo, geriatra, cuidador"
                    value={role}
                    onValueChange={setRole}
                  />
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
