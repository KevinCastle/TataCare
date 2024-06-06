import {
  Button, Card, CardBody, CardFooter, Image,
} from '@nextui-org/react';
import { CaretRight, SignOut } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { signOut } from '../../auth';
import { fetchElders } from '../api/data';

const page = async () => {
  const elders = await fetchElders();

  return (
    <main className="bg-zinc-200 min-h-svh relative">
      <form
        action={async () => {
          'use server';

          await signOut();
        }}
      >
        <Button
          className="absolute top-2 right-2"
          color="primary"
          radius="lg"
          size="md"
          type="submit"
        >
          <SignOut size={32} />
          Cerrar sesión
        </Button>
      </form>
      <article className="h-full py-4">
        <section className="row-span-1 flex items-center justify-center h-[25vh]">
          <h1 className="text-3xl text-center">Lista de abuelitos</h1>
        </section>
        <section className="row-span-2 container flex flex-col h-full px-6 xs:px-0">
          <div className="flex flex-wrap justify-center items-center gap-6">
            {elders.map((elder) => (
              <Link href={`/app/${elder.id}`} scroll={false} key={elder.id}>
                <Card className="xs:flex-[0_0_45%] sm:flex-[0_0_33.3333%] lg:flex-[0_0_23%] w-full sm:w-[200px]" shadow="sm" key={elder.id} isPressable>
                  <CardBody className="overflow-visible p-0">
                    <Image
                      shadow="sm"
                      radius="lg"
                      width="100%"
                      alt={elder.name}
                      className="w-full object-cover object-top h-[200px]"
                      src="https://images.unsplash.com/photo-1612838320302-4b3b3b3b3b3b"
                    />
                  </CardBody>
                  <CardFooter className="text-small justify-between">
                    <p className="text-xl font-bold">{elder.name}</p>
                    <span className="text-tiny h-8 w-0 flex justify-center items-center text-white bg-cyan-700/60 min-w-8 p-0 rounded-full">
                      <CaretRight size={16} />
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
};

export default page;
