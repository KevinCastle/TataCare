'use client';

import {
  Card, CardBody, CardFooter, Image,
} from '@nextui-org/react';
import { CaretRight } from '@phosphor-icons/react/dist/ssr';
import { useRouter } from 'next/navigation';
import { Elder } from '../api/elders/types';
import { useElderStore } from '../store/elderStore';

interface ElderCardListProps {
    elders: Elder[];
}

export default function ElderCardList({ elders }: ElderCardListProps) {
  const router = useRouter();
  const fullName = (name: string, surname: string) => `${name} ${surname}`;

  const handleElderClick = (elder: Elder) => {
    useElderStore.setState({ selectedElder: elder });
    router.push(`/app/${elder.id}`);
  };

  return (
    <section className="row-span-2 container flex flex-col h-full px-6 xs:px-0">
      <div className="flex flex-wrap justify-center items-center gap-6">
        {elders && elders.length > 0 && elders.map((elder) => (
          <Card className="xs:flex-[0_0_45%] sm:flex-[0_0_33.3333%] lg:flex-[0_0_23%] w-full sm:w-[200px]" shadow="sm" key={elder.id} isPressable onPress={() => handleElderClick(elder)}>
            <CardBody className="overflow-visible p-0">
              <Image
                shadow="sm"
                radius="lg"
                width="100%"
                alt={fullName(elder.name, elder.surname)}
                className="w-full object-cover object-top h-[270px]"
                src={elder.avatar}
              />
            </CardBody>
            <CardFooter className="text-small justify-between">
              <p className="text-xl font-bold truncate">{fullName(elder.name, elder.surname)}</p>
              <span className="text-tiny h-8 w-0 flex justify-center items-center text-white bg-cyan-700/60 min-w-8 p-0 rounded-full">
                <CaretRight size={16} />
              </span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
