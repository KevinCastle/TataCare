/* eslint-disable react/no-array-index-key */

'use client';

import {
  Button, ModalBody, ModalContent, ModalFooter, ModalHeader,
  Textarea,
} from '@nextui-org/react';
import {
  MutableRefObject, useEffect, useRef, useState,
} from 'react';
import { v4 } from 'uuid';
import {
  Smiley, SmileyMeh, SmileyNervous, SmileySad, SmileyWink, Star,
  ThumbsDown,
  ThumbsUp,
} from '@phosphor-icons/react/dist/ssr';
import {
  useCommentStore, useElderStore,
} from '../store';
import { useUserStore } from '../store/userStore';

export default function CommentForm() {
  const [dayRating, setDayRating] = useState<number>(0);
  const [emotionRating, setEmotionRating] = useState<number>(0);
  const [digestionRating, setDigestionRating] = useState<number>(0);
  const [physicalActivity, setPhysicalActivity] = useState<boolean>(false);
  const [note, setNote] = useState<string>('');
  const [error, setError] = useState<string>('');
  const onCloseRef: MutableRefObject<(() => void) | null> = useRef<(() => void) | null>(null);

  const { getUser, user } = useUserStore((state) => ({
    getUser: state.get,
    user: state.user,
  }));

  const { selectedElder: elder } = useElderStore((state) => ({
    selectedElder: state.selectedElder,
  }));

  const {
    addComment,
  } = useCommentStore((state) => ({
    addComment: state.add,
  }));

  function validateForm() {
    if (dayRating < 1) {
      setError('La puntuación del día es requerida.');
      return false;
    }
    if (emotionRating < 1) {
      setError('La puntuación de emoción es requerida.');
      return false;
    }
    if (digestionRating < 1) {
      setError('La puntuación de digestión es requerida.');
      return false;
    }
    if (!note.trim()) {
      setError('Incluya una nota.');
      return false;
    }
    return true;
  }

  const submitForm = () => {
    if (!validateForm()) {
      return;
    }
    if (elder && user) {
      const commentsModified = {
        id: '',
        elder_id: elder.id,
        caregiver_id: user.id,
        day_rating: dayRating,
        emotion_rating: emotionRating,
        digestion_rating: digestionRating,
        physical_activity: physicalActivity,
        note,
        date: new Date().toISOString(),
      };

      commentsModified.id = v4();
      addComment(commentsModified);

      if (onCloseRef.current) {
        onCloseRef.current();
      }
    }
  };

  useEffect(() => {
    if (!user) getUser();
  }, [getUser, user]);

  const dailyStars = Array.from({ length: 5 }, (_, i) => 5 - i).map((number) => (
    <Star
      key={number}
      size={48}
      weight="fill"
      className={`text-yellow-100 peer ${dayRating >= number ? 'text-yellow-500' : 'peer-hover:text-yellow-500 hover:text-yellow-500'} mx-2`}
      onClick={() => setDayRating(number)}
    />
  ));

  const digestionStars = Array.from({ length: 5 }, (_, i) => 5 - i).map((number) => (
    <Star
      key={number}
      size={48}
      weight="fill"
      className={`text-yellow-100 peer ${digestionRating >= number ? 'text-yellow-500' : 'peer-hover:text-yellow-500 hover:text-yellow-500'} mx-2`}
      onClick={() => setDigestionRating(number)}
    />
  ));

  return (
    (
      <ModalContent>
        {(onClose) => {
          onCloseRef.current = onClose;
          return (
            <>
              <ModalHeader className="flex flex-col gap-1">Agregar commentario</ModalHeader>
              <ModalBody>
                <form className="flex flex-col gap-y-5">
                  <span>¿Cómo estuvo el día?</span>
                  <div className="flex flex-row-reverse justify-around">
                    {dailyStars}
                  </div>
                  <span>¿Cómo estuvo emocionalmente?</span>
                  <div className="flex flex-row-reverse justify-around">
                    <SmileyWink size={48} weight="fill" className={`text-zinc-200 hover:text-green-400 ${emotionRating === 5 && 'text-green-400'} mx-2`} onClick={() => setEmotionRating(5)} />
                    <Smiley size={48} weight="fill" className={`text-zinc-200 hover:text-yellow-300 ${emotionRating === 4 && 'text-yellow-300'} mx-2`} onClick={() => setEmotionRating(4)} />
                    <SmileyMeh size={48} weight="fill" className={`text-zinc-200 hover:text-yellow-200 ${emotionRating === 3 && 'text-yellow-200'} mx-2`} onClick={() => setEmotionRating(3)} />
                    <SmileyNervous size={48} weight="fill" className={`text-zinc-200 hover:text-red-200 ${emotionRating === 2 && 'text-red-200'} mx-2`} onClick={() => setEmotionRating(2)} />
                    <SmileySad size={48} weight="fill" className={`text-zinc-200 hover:text-red-400 ${emotionRating === 1 && 'text-red-400'} mx-2`} onClick={() => setEmotionRating(1)} />
                  </div>
                  <span>¿Cómo estuvo la digestión?</span>
                  <div className="flex flex-row-reverse justify-around">
                    {digestionStars}
                  </div>
                  <span>¿Hubo actividad física?</span>
                  <div className="flex justify-center">
                    <ThumbsDown size={48} weight="fill" className={`text-zinc-200 hover:text-red-500 ${!physicalActivity && 'text-red-500'} mx-4`} onClick={() => setPhysicalActivity(false)} />
                    <ThumbsUp size={48} weight="fill" className={`text-zinc-200 hover:text-green-500 ${physicalActivity && 'text-green-500'} mx-4`} onClick={() => setPhysicalActivity(true)} />
                  </div>
                  <Textarea
                    isRequired
                    label="Agrega una nota al comentario"
                    labelPlacement="outside"
                    placeholder="Enter your description"
                    className="w-full text-base"
                    value={note}
                    onValueChange={setNote}
                  />
                </form>
              </ModalBody>
              <ModalFooter>
                {error && (<p>{error}</p>)}
                <Button color="danger" variant="light" onPress={onClose}>
                  Atrás
                </Button>
                <Button color="primary" onPress={() => { submitForm(); }}>
                  Agregar
                </Button>
              </ModalFooter>
            </>
          );
        }}
      </ModalContent>

    )
  );
}
