import { Button } from '@nextui-org/react';
import { SignOut } from '@phosphor-icons/react/dist/ssr';
import { signOut } from '../../auth';
import ElderCardList from '../components/elderCardList';
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
        <ElderCardList elders={elders} />
      </article>
    </main>
  );
};

export default page;
