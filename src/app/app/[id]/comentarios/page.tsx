'use client';

import FormModal from '@/app/components/formModal';
import { useCommentStore, useElderStore } from '@/app/store';
import { ChatCircle } from '@phosphor-icons/react/dist/ssr';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import CommentCard from '@/app/components/commentCard';

function Page() {
  const pathname = usePathname();
  const elderId = pathname.split('/')[2];

  const { getElder, selectedElder: elder } = useElderStore((state) => ({
    getElder: state.getElder,
    selectedElder: state.selectedElder,
  }));

  const { getComments, comments } = useCommentStore((state) => ({
    getComments: state.get,
    comments: state.comments,
  }));

  useEffect(() => {
    if (elderId) {
      if (!elder && elderId) {
        getElder(elderId);
      }
      if (elder) {
        getComments(elderId);
      }
    }
  }, [elder, elderId, getElder, getComments]);

  return (
    <main className="h-[calc(100vh-64px)] lg:h-[calc(100vh-32px)] 2xl:h-[calc(100vh-64px)] px-4 md:px-8 relative">
      <header className="flex justify-between mb-4 pt-10">
        <div className="flex items-center">
          <ChatCircle color="#006FEE" className="text-xl lg:text-3xl mr-[2px] lg:mr-2" />
          <p className="text-base lg:text-2xl font-medium">Comentarios</p>
        </div>
        <FormModal type="comment" />
      </header>
      {comments.length === 0 ? (
        <div className="flex justify-center items-center w-full h-[calc(100%-96px)]">
          <p className="text-xl text-center">Aún no tiene comentarios registrados</p>
        </div>
      ) : (
        <article className="grid gap-4 pb-10">
          {comments.map((comment) => (
            <section className="mb-4" key={comment.id}>
              <CommentCard comment={comment} />
            </section>
          ))}
        </article>
      )}
    </main>
  );
}

export default Page;
