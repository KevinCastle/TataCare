'use client';

import React, { useEffect, useState } from 'react';
import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure,
} from '@nextui-org/react';
import { Trash } from '@phosphor-icons/react/dist/ssr';
import { usePathname } from 'next/navigation';
import {
  useCommentStore, useContactStore, useElderStore, useMedicationStore, useTasteStore,
} from '../store';

type DeleteModalProps = {
  id: string,
  type: 'elder' | 'medication' | 'taste' | 'contact' | 'comment';
}

export default function DeleteModal({ id, type }: DeleteModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [elderId, setElderId] = useState<string>('');
  const pathname = usePathname();

  const { removeElder } = useElderStore((state) => ({
    removeElder: state.remove,
  }));

  const { getTastes, removeTaste, tastes } = useTasteStore((state) => ({
    getTastes: state.get,
    tastes: state.tastes,
    removeTaste: state.remove,
  }));

  const { getMedications, removeMedication, medications } = useMedicationStore((state) => ({
    getMedications: state.get,
    medications: state.medications,
    removeMedication: state.remove,
  }));

  const { getContacts, removeContact, contacts } = useContactStore((state) => ({
    getContacts: state.get,
    contacts: state.contacts,
    removeContact: state.remove,
  }));

  const { getComments, removeComment, comments } = useCommentStore((state) => ({
    getComments: state.get,
    comments: state.comments,
    removeComment: state.remove,
  }));

  const removeElement = () => {
    switch (type) {
      case 'elder': {
        removeElder(elderId);
        break;
      }
      case 'medication': {
        const medication = medications.find((medication) => medication.id === id);
        if (medication) {
          removeMedication(medication);
        }
        break;
      }
      case 'taste': {
        const taste = tastes.find((taste) => taste.id === id);
        if (taste) {
          removeTaste(taste);
        }
        break;
      }
      case 'contact': {
        const contact = contacts.find((contact) => contact.id === id);
        if (contact) {
          removeContact(contact);
        }
        break;
      }
      case 'comment': {
        const comment = comments.find((comment) => comment.id === id);
        if (comment) {
          removeComment(comment);
        }
        break;
      }
      default:
        break;
    }
  };

  useEffect(() => {
    setElderId(pathname.split('/')[2]);
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
      case 'comment': {
        getComments(elderId);
        break;
      }
      default:
        break;
    }
  }, [id, type, pathname, getMedications, getTastes, getContacts, getComments, setElderId, elderId]);

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
                  <Button color="primary" onPress={removeElement}>
                    Eliminar
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
