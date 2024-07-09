'use client';

import {
  Modal, Button, useDisclosure,
} from '@nextui-org/react';
import { Pencil, Plus } from '@phosphor-icons/react/dist/ssr';
import ElderForm from './elderForm';
import MedicationForm from './medicationForm';
import ConditionForm from './conditionForm';
import TasteForm from './tasteForm';

type FormModalProps = {
  id?: string,
  type: 'elder' | 'medication' | 'condition' | 'taste' | 'contact' | 'comment';
}

export default function FormModal({ id, type }: FormModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  function translateType() {
    switch (type) {
      case 'elder':
        return 'abuelito';
      case 'medication':
        return 'medicamento';
      case 'condition':
        return 'condición';
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
            {type === 'elder' && (<ElderForm elderId={id} />)}
            {type === 'medication' && (<MedicationForm id={id} />)}
            {type === 'condition' && (<ConditionForm id={id} />)}
            {type === 'taste' && (<TasteForm id={id} />)}
          </Modal>
        </>
      ) : (
        <>
          <Button color="primary" size="sm" type="button" onPress={onOpen} className="px-2 lg:px-3">
            <Plus size={20} weight="bold" className="hidden lg:block" />
            <span>{`Agregar ${translateType()}`}</span>
          </Button>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
            {type === 'elder' && (<ElderForm />)}
            {type === 'medication' && (<MedicationForm />)}
            {type === 'condition' && (<ConditionForm />)}
            {type === 'taste' && (<TasteForm />)}
          </Modal>
        </>
      )}
    </div>
  );
}
