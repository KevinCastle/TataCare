import { Button } from '@nextui-org/react';
import { Star } from '@phosphor-icons/react/dist/ssr';
import { useEffect, useState } from 'react';
import { Medication } from '../api/medications/types';
import { useContactStore, useElderStore, useMedicationStore } from '../store';
import { Contact } from '../api/contacts/types';

interface LikeButtonProps {
  id: string;
  type: 'elder' | 'medication' | 'condition' | 'taste' | 'contact' | 'comment';
}

function LikeButton({ id, type }: LikeButtonProps) {
  const [medication, setMedication] = useState<Medication | null>(null);
  const [contact, setContact] = useState<Contact | null>(null);

  const {
    editElder, selectedElder: elder,
  } = useElderStore((state) => ({
    editElder: state.edit,
    selectedElder: state.selectedElder,
  }));

  const {
    editMedication, medications,
  } = useMedicationStore((state) => ({
    editMedication: state.edit,
    medications: state.medications,
  }));

  const {
    contacts,
  } = useContactStore((state) => ({
    contacts: state.contacts,
  }));

  const handleLike = () => {
    if (type === 'medication') {
      if (medication) {
        medication.favorite = !medication.favorite;
        editMedication(medication);
      }
    }
    if (type === 'contact') {
      if (elder && contact) {
        const elderModified = { ...elder };
        elderModified.favorite_contact = contact.id;
        editElder(elder.id, elderModified);
      }
    }
  };

  useEffect(() => {
    if (type === 'medication' && medications) {
      setMedication(medications.find((medication: Medication) => medication.id === id) || null);
    }
    if (type === 'contact' && contacts) {
      setContact(contacts.find((contact: Contact) => contact.id === id) || null);
    }
  }, [id, type, medications, contacts]);

  return (
    <Button onPress={handleLike} aria-label="Marcar como favorito y mostrar en la ficha" type="button" className="h-8 w-8 min-w-0 flex justify-center items-center bg-transparent hover:bg-zinc-300/80 transition-colors duration-150 rounded-full px-1">
      {medication && medication.favorite && <Star size={24} weight="fill" color="#F5A524" />}
      {medication && !medication.favorite && <Star size={24} weight="bold" color="#F5A524" />}
      {contact && elder && contact.id === elder.favorite_contact && <Star size={24} weight="fill" color="#F5A524" />}
      {contact && (!elder || contact.id !== elder.favorite_contact) && <Star size={24} weight="bold" color="#F5A524" />}
    </Button>
  );
}

export default LikeButton;
