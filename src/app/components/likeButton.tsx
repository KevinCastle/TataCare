import { Button } from '@nextui-org/react';
import { Star } from '@phosphor-icons/react/dist/ssr';
import { useEffect, useState } from 'react';
import { Medication } from '../api/medications/types';
import { useMedicationStore } from '../store';

interface LikeButtonProps {
  id: string;
  type: 'elder' | 'medication' | 'condition' | 'taste' | 'contact' | 'comment';
}

function LikeButton({ id, type }: LikeButtonProps) {
  const [medication, setMedication] = useState<Medication | null>(null);
  const {
    editMedication, medications,
  } = useMedicationStore((state) => ({
    editMedication: state.edit,
    medications: state.medications,
  }));

  const handleLike = () => {
    if (type === 'medication') {
      if (medication) {
        medication.favorite = !medication.favorite;
        editMedication(medication);
      }
    }
  };

  useEffect(() => {
    if (type === 'medication' && medications) {
      setMedication(medications.find((medication: Medication) => medication.id === id) || null);
    }
  }, [id, type, medications]);

  return (
    <Button onPress={handleLike} type="button" className="h-8 w-8 min-w-0 flex justify-center items-center bg-transparent hover:bg-zinc-300/80 transition-colors duration-150 rounded-full px-1">
      {medication && medication.favorite && <Star size={24} weight="fill" color="#F5A524" />}
      {medication && !medication.favorite && <Star size={24} weight="bold" color="#F5A524" />}
    </Button>
  );
}

export default LikeButton;
