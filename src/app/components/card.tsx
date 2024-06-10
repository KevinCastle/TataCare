import {
  Card, CardHeader, CardBody, Divider, Avatar,
  CardFooter,
} from '@nextui-org/react';
import { ReactNode } from 'react';
import ActionButton from './actionButton';

interface CardProps {
    title?: string;
    avatar?: string;
    icon?: ReactNode;
    type?: 'user' | 'medicine' | 'taste' | 'contact' | 'comment' | undefined;
    edit?: () => void;
    erase?: () => void;
    like?: () => void;
    children: ReactNode;
    footerContent?: ReactNode;
}

const card: React.FC<CardProps> = ({
  title,
  avatar,
  icon,
  type,
  edit,
  erase,
  like,
  children,
  footerContent,
}) => (
  <Card className="w-full">
    {title && (
    <CardHeader className="flex gap-3">
        {avatar && !icon && <Avatar showFallback src={avatar} />}
        {icon && !avatar && icon}
      <p className="text-xl font-medium">{title}</p>
      <div className="ml-auto">
        {edit && <ActionButton action="edit" type={type} />}
        {erase && <ActionButton action="erase" type={type} />}
        {like && <ActionButton action="like" type={type} />}
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
