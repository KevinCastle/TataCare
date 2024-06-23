'use client';

import {
  Modal, Button, useDisclosure,
} from '@nextui-org/react';
import { Pencil, Plus } from '@phosphor-icons/react/dist/ssr';
import ElderForm from './elderForm';
import MedicationForm from './medicationForm';

type FormModalProps = {
  id?: string,
  type: 'elder' | 'medication' | 'taste' | 'contact' | 'comment';
}

export default function FormModal({ id, type }: FormModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  function translateType() {
    switch (type) {
      case 'elder':
        return 'abuelito';
      case 'medication':
        return 'medicamento';
      case 'taste':
        return 'gusto';
      case 'contact':
        return 'contacto';
      case 'comment':
        return 'comentario';
      default:
        return '';
    }
  }

  return (
    <div>
      {id ? (
        <>
          <Button type="button" onPress={onOpen} className="h-8 w-8 min-w-0 flex justify-center items-center bg-transparent hover:bg-zinc-300/80 transition-colors duration-150 rounded-full px-1">
            <Pencil size={24} weight="bold" color="#002E62" />
          </Button>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
            <ElderForm elderId={id} />
          </Modal>
        </>
      ) : (
        <>
          <Button color="primary" type="button" onPress={onOpen}>
            <Plus size={20} weight="bold" />
            <span>{`Agregar ${translateType()}`}</span>
          </Button>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
            {type === 'elder' && (<ElderForm />)}
            {type === 'medication' && (<MedicationForm />)}
          </Modal>
        </>
      )}
    </div>
  );
}
