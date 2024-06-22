'use client';

import React, { useEffect, useState } from 'react';
import {
  Modal, Button, useDisclosure,
} from '@nextui-org/react';
import { Pencil } from '@phosphor-icons/react/dist/ssr';
import { usePathname } from 'next/navigation';
import ElderForm from './elderForm';

type FormModalProps = {
  id?: string,
  type: 'elder' | 'medication' | 'taste' | 'contact' | 'comment';
}

export default function FormModal({ id, type }: FormModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [elderId, setElderId] = useState<string>('');
  const pathname = usePathname();
  if (type !== 'elder') {
    setElderId(pathname.split('/')[2]);
  }

  // const { getTastes, editTaste, tastes } = useTasteStore((state) => ({
  //   getTastes: state.get,
  //   tastes: state.tastes,
  //   editTaste: state.edit,
  // }));

  // const { getMedications, editMedication, medications } = useMedicationStore((state) => ({
  //   getMedications: state.get,
  //   medications: state.medications,
  //   editMedication: state.edit,
  // }));

  // const { getContacts, editContact, contacts } = useContactStore((state) => ({
  //   getContacts: state.get,
  //   contacts: state.contacts,
  //   editContact: state.edit,
  // }));

  // const editElement = () => {
  //   if (elder) {
  //     switch (type) {
  //       case 'elder': {
  //         editElder(elderId, elder);
  //         break;
  //       }
  //       case 'medication': {
  //         const medication = medications.find((medication) => medication.id === id);
  //         if (medication) {
  //           editMedication(elderId, medication);
  //         }
  //         break;
  //       }
  //       case 'taste': {
  //         const taste = tastes.find((taste) => taste.id === id);
  //         if (taste) {
  //           editTaste(elderId, taste);
  //         }
  //         break;
  //       }
  //       case 'contact': {
  //         const contact = contacts.find((contact) => contact.id === id);
  //         if (contact) {
  //           editContact(elderId, contact);
  //         }
  //         break;
  //       }
  //       default:
  //         break;
  //     }
  //   }
  // };

  useEffect(() => {
    setElderId(pathname.split('/')[2]);
    // switch (type) {
    //   case 'medication': {
    //     getMedications(elderId);
    //     break;
    //   }
    //   case 'taste': {
    //     getTastes(elderId);
    //     break;
    //   }
    //   case 'contact': {
    //     getContacts(elderId);
    //     break;
    //   }
    //   default:
    //     break;
    // }
  }, [id, type, pathname, setElderId, elderId]);

  return (
    <div>
      {id ? (
        <>
          <Button type="button" onPress={onOpen} className="h-8 w-8 min-w-0 flex justify-center items-center bg-zinc-200/60 hover:bg-zinc-300/80 transition-colors duration-150 rounded-full px-1">
            <Pencil size={24} weight="bold" color="#F31260" />
          </Button>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
            <ElderForm elderId={id} />
          </Modal>
        </>
      ) : (
        <>
          <Button color="primary" type="button" onPress={onOpen}>
            Registrar
          </Button>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
            <ElderForm />
          </Modal>
        </>
      )}
    </div>
  );
}
