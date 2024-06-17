import {
  Card, CardHeader, CardBody, Divider,
} from '@nextui-org/react';
import { Comment } from '../api/comments/types';
import { formatDateTime } from '../utils';

interface CommentProps {
  comment: Comment;
}

const commentCard: React.FC<CommentProps> = ({
  comment,
}) => (
  <Card className="w-full h-fit">
    <CardHeader className="p-3">
      <p className="text-xl font-medium">{comment.note}</p>
    </CardHeader>
    <Divider />
    <CardBody className="grid grid-cols-5">
      <div className="col-span-1">
        <p>Día</p>
        <p>{comment.day_rating}</p>
      </div>
      <div className="col-span-1">
        <p>Emoción</p>
        <p>{comment.day_rating}</p>
      </div>
      <div className="col-span-1">
        <p>Físico</p>
        <p>{comment.physical_activity ? 'Sí' : 'No'}</p>
      </div>
      <div className="col-span-1">
        <p>Digestión</p>
        <p>{comment.digestion_rating}</p>
      </div>
      <div className="col-span-1">
        <p>Fecha</p>
        <p>{formatDateTime(comment.date)}</p>
      </div>
    </CardBody>
  </Card>
);

export default commentCard;
