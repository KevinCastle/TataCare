import {
  Card, CardHeader, CardBody, Divider,
} from '@nextui-org/react';
import { useEffect } from 'react';
import { Comment } from '../api/comments/types';
import { formatDateTime } from '../utils';
import { useUserStore } from '../store/userStore';

interface CommentProps {
  comment: Comment;
}

export default function CommentCard({ comment }: CommentProps) {
  const { getUser, user } = useUserStore((state) => ({
    getUser: state.get,
    user: state.user,
  }));

  useEffect(() => {
    if (!user) getUser(comment.caregiver_id);
  }, [getUser, user, comment.caregiver_id]);

  return (
    <Card className="w-full h-fit">
      <CardHeader className="p-3">
        <p className="text-xl font-medium">
          <span className="font-semibold text-zinc-700">{`${user?.name} ${user?.surname}: `}</span>
          {comment.note}
        </p>
      </CardHeader>
      <Divider />
      <CardBody className="grid grid-cols-5">
        <div className="col-span-5 sm:col-span-1 mb-3 sm:mb-0">
          <p>Día</p>
          <p>{comment.day_rating}</p>
        </div>
        <div className="col-span-5 sm:col-span-1 mb-3 sm:mb-0">
          <p>Emoción</p>
          <p>{comment.day_rating}</p>
        </div>
        <div className="col-span-5 sm:col-span-1 mb-3 sm:mb-0">
          <p>Físico</p>
          <p>{comment.physical_activity ? 'Sí' : 'No'}</p>
        </div>
        <div className="col-span-5 sm:col-span-1 mb-3 sm:mb-0">
          <p>Digestión</p>
          <p>{comment.digestion_rating}</p>
        </div>
        <div className="col-span-5 sm:col-span-1 mb-3 sm:mb-0">
          <p>Fecha</p>
          <p>{formatDateTime(comment.date)}</p>
        </div>
      </CardBody>
    </Card>
  );
}
