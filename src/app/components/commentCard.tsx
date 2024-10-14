import {
  Card, CardHeader, CardBody, Divider,
  CardFooter,
  Avatar,
} from '@nextui-org/react';
import { useEffect, useState } from 'react';
import {
  Smiley, SmileyMeh, SmileyNervous, SmileySad, SmileyWink, Star, ThumbsDown, ThumbsUp,
} from '@phosphor-icons/react/dist/ssr';
import clsx from 'clsx';
import { Comment } from '../api/comments/types';
import { formatDateTime } from '../utils';
import { useUserStore } from '../store/userStore';
import DeleteModal from './deleteModal';
import { User } from '../api/user/types';

interface CommentProps {
  comment: Comment;
}

export default function CommentCard({ comment }: CommentProps) {
  const [caregiver, setCaregiver] = useState<User | null>(null);
  const { getUser } = useUserStore((state) => ({
    getUser: state.getById,
  }));

  const dailyStars = Array.from({ length: 5 }, (_, i) => 5 - i).map((number) => (
    <Star
      key={number}
      size={24}
      weight="fill"
      className={`text-yellow-100 ${comment.day_rating >= number && 'text-yellow-500'} mx-2 lg:mx-0`}

    />
  ));

  const digestionStars = Array.from({ length: 5 }, (_, i) => 5 - i).map((number) => (
    <Star
      key={number}
      size={24}
      weight="fill"
      className={`text-yellow-100 ${comment.digestion_rating >= number && 'text-yellow-500'} mx-2 lg:mx-0`}
    />
  ));

  useEffect(() => {
    if (!caregiver) {
      getUser(comment.caregiver_id).then((user) => {
        setCaregiver(user);
      });
    }
  }, [getUser, comment, caregiver]);

  return (
    (
      <Card className="w-full h-fit">
        <CardHeader className=" p-3">
          <div className="flex items-center">
            <Avatar showFallback src={caregiver?.avatar} />
            <div className="ml-2">
              <p className="text-xl font-semibold text-zinc-700">
                {`${caregiver?.name} ${caregiver?.surname}`}
              </p>
              <p className="text-zinc-700">{formatDateTime(comment.date)}</p>
            </div>
          </div>
          <div className="ml-auto">
            {comment.id && <DeleteModal id={comment.id} type="comment" />}
          </div>
        </CardHeader>
        <CardBody className="">
          <p className="text-lg font-medium">
            {comment.note}
          </p>
        </CardBody>
        <Divider />
        <CardFooter className="grid grid-cols-4">
          <div className="col-span-4 sm:col-span-1 flex items-center justify-between sm:block mb-3 sm:mb-0 sm:text-center">
            <p>Día</p>
            <div className="flex flex-row-reverse justify-center my-2">
              {dailyStars}
            </div>
          </div>
          <div className="col-span-4 sm:col-span-1 flex items-center justify-between sm:block mb-3 sm:mb-0 sm:text-center">
            <p>Emoción</p>
            <div className="flex flex-row-reverse justify-center my-2">
              <SmileyWink size={24} weight="fill" className={clsx('text-green-400 mx-2 lg:mx-0', { 'text-zinc-200': comment.emotion_rating !== 5 })} />
              <Smiley size={24} weight="fill" className={clsx('text-yellow-300 mx-2 lg:mx-0', { 'text-zinc-200': comment.emotion_rating !== 4 })} />
              <SmileyMeh size={24} weight="fill" className={clsx('text-yellow-200 mx-2 lg:mx-0', { 'text-zinc-200': comment.emotion_rating !== 3 })} />
              <SmileyNervous size={24} weight="fill" className={clsx('text-red-200 mx-2 lg:mx-0', { 'text-zinc-200': comment.emotion_rating !== 2 })} />
              <SmileySad size={24} weight="fill" className={clsx('text-red-400 mx-2 lg:mx-0', { 'text-zinc-200': comment.emotion_rating !== 1 })} />
            </div>
          </div>
          <div className="col-span-4 sm:col-span-1 flex items-center justify-between sm:block mb-3 sm:mb-0 sm:text-center">
            <p>Digestión</p>
            <div className="flex flex-row-reverse justify-center my-2">
              {digestionStars}
            </div>
          </div>
          <div className="col-span-4 sm:col-span-1 flex items-center justify-between sm:block mb-3 sm:mb-0 sm:text-center">
            <p>Actividad física</p>
            <div className="flex justify-center my-2">
              <ThumbsDown size={24} weight="fill" className={clsx('text-red-100 mx-4', { 'text-red-500': !comment.physical_activity })} />
              <ThumbsUp size={24} weight="fill" className={clsx('text-green-100 mx-4', { 'text-green-500': comment.physical_activity })} />
            </div>
          </div>
        </CardFooter>
      </Card>
    )
  );
}
