import {
  Card, CardHeader, CardBody, Divider, Avatar,
  CardFooter,
} from '@nextui-org/react';
import { ReactNode } from 'react';
import EditModal from './editModal';
import LikeButton from './likeButton';
import DeleteModal from './deleteModal';

interface CardProps {
    title?: string;
    avatar?: string;
    icon?: ReactNode;
    type?: 'elder' | 'medication' | 'taste' | 'contact' | 'comment';
    action?: 'edit' | 'delete' | 'like';
    id?: string;
    children: ReactNode;
    footerContent?: ReactNode;
}

const card: React.FC<CardProps> = ({
  title,
  avatar,
  icon,
  type,
  action,
  id,
  children,
  footerContent,
}) => (
  <Card className="h-full w-full">
    {title && (
    <CardHeader className="flex gap-3">
        {avatar && !icon && <Avatar showFallback src={avatar} />}
        {icon && !avatar && icon}
      <p className="text-xl font-medium">{title}</p>
      <div className="ml-auto">
        {action === 'edit' && type && id && <EditModal id={id} type={type} />}
        {action === 'like' && type && <LikeButton type={type} />}
        {action === 'delete' && type && id && <DeleteModal id={id} type={type} />}
      </div>

    </CardHeader>
    )}
    <Divider />
    <CardBody>
      {children}
    </CardBody>
    <Divider />
    {footerContent && (
    <CardFooter>
        {footerContent}
    </CardFooter>
    )}
  </Card>
);

export default card;
