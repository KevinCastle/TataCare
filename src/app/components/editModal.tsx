'use client';

import React, { useEffect, useState } from 'react';
import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure,
} from '@nextui-org/react';
import { Trash } from '@phosphor-icons/react/dist/ssr';
import { usePathname } from 'next/navigation';
import {
  useContactStore, useElderStore, useMedicationStore, useTasteStore,
} from '../store';

type EditModalProps = {
  id: string,
  type: 'elder' | 'medication' | 'taste' | 'contact' | 'comment';
}

export default function EditModal({ id, type }: EditModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [elderId, setElderId] = useState<string>('');
  const pathname = usePathname();

  const { getElder, editElder, selectedElder: elder } = useElderStore((state) => ({
    getElder: state.getElder,
    editElder: state.edit,
    selectedElder: state.selectedElder,
  }));

  const { getTastes, editTaste, tastes } = useTasteStore((state) => ({
    getTastes: state.get,
    tastes: state.tastes,
    editTaste: state.edit,
  }));

  const { getMedications, editMedication, medications } = useMedicationStore((state) => ({
    getMedications: state.get,
    medications: state.medications,
    editMedication: state.edit,
  }));

  const { getContacts, editContact, contacts } = useContactStore((state) => ({
    getContacts: state.get,
    contacts: state.contacts,
    editContact: state.edit,
  }));

  const editElement = () => {
    if (elder) {
      switch (type) {
        case 'elder': {
          editElder(elderId, elder);
          break;
        }
        case 'medication': {
          const medication = medications.find((medication) => medication.id === id);
          if (medication) {
            editMedication(elderId, medication);
          }
          break;
        }
        case 'taste': {
          const taste = tastes.find((taste) => taste.id === id);
          if (taste) {
            editTaste(elderId, taste);
          }
          break;
        }
        case 'contact': {
          const contact = contacts.find((contact) => contact.id === id);
          if (contact) {
            editContact(elderId, contact);
          }
          break;
        }
        default:
          break;
      }
    }
  };

  useEffect(() => {
    setElderId(pathname.split('/')[2]);
    getElder(elderId);
    switch (type) {
      case 'medication': {
        getMedications(elderId);
        break;
      }
      case 'taste': {
        getTastes(elderId);
        break;
      }
      case 'contact': {
        getContacts(elderId);
        break;
      }
      default:
        break;
    }
  }, [id, type, pathname, getMedications, getTastes, getContacts, setElderId, elderId, getElder]);

  return (
    <div>
      {elderId && (
        <>
          <Button type="button" onPress={onOpen} className="h-8 w-8 min-w-0 flex justify-center items-center bg-zinc-200/60 hover:bg-zinc-300/80 transition-colors duration-150 rounded-full px-1">
            <Trash size={24} weight="bold" color="#F31260" />
          </Button>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">¿Está seguro?</ModalHeader>
                  <ModalBody>
                    <p>
                      Esta acción no puede retrocederse.
                    </p>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Atrás
                    </Button>
                    <Button color="primary" onPress={editElement}>
                      Guardar cambios
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </>
      )}
    </div>
  );
}
