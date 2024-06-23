import {
  Card, CardHeader, CardBody, Divider, Avatar,
  CardFooter,
} from '@nextui-org/react';
import { ReactNode } from 'react';
import FormModal from './formModal';
import LikeButton from './likeButton';
import DeleteModal from './deleteModal';

interface CardProps {
    title?: string;
    avatar?: string;
    icon?: ReactNode;
    type?: 'elder' | 'medication' | 'taste' | 'contact' | 'comment';
    edit?: boolean;
    remove?: boolean;
    like?: boolean;
    id?: string;
    children: ReactNode;
    footerContent?: ReactNode;
}

const card: React.FC<CardProps> = ({
  title,
  avatar,
  icon,
  type,
  edit,
  remove,
  like,
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
      <div className="ml-auto flex gap-x-1">
        {edit && type && <FormModal id={id} type={type} />}
        {remove && type && id && <DeleteModal id={id} type={type} />}
        {like && type && id && <LikeButton type={type} />}
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
