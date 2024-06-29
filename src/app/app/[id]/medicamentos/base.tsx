// 'use client';

// import { useElderStore, useMedicationStore } from '@/app/store';
// import { Pill } from '@phosphor-icons/react/dist/ssr';
// import { usePathname } from 'next/navigation';
// import { useEffect } from 'react';

// function Page() {
//     const pathname = usePathname();
//     const elderId = pathname.split('/').pop();
//     const { getElder, selectedElder: elder } = useElderStore((state) => ({
//         getElder: state.getElder,
//         selectedElder: state.selectedElder,
//     }));

//     const { getMedications, medications } = useMedicationStore((state) => ({
//         getMedications: state.get,
//         medications: state.medications,
//     }));

//     useEffect(() => {
//         if (elderId) {
//             if (!elder && elderId) {
//                 getElder(elderId);
//             }
//             if (elder) {
//                 getMedications(elderId);
//             }
//         }
//     }, [elder, elderId, getElder, getMedications]);

//     return (
//         <article className="h-[calc(100vh-64px)] lg:h-[calc(100vh-32px)] 2xl:h-[calc(100vh-64px)] px-4 md:px-8 relative">
//             <header className="flex items-center mb-4 pt-10">
//                 <Pill color="#006FEE" size={32} className="mr-2" />
//                 <p className="text-2xl font-medium">Medicamentos</p>
//             </header>
//             {!medications && <p>Cargando...</p>}
//             {medications && (
//                 <section className="">
//                     <p>hello world</p>
//                 </section>
//             )}
//         </article>
//     );
// }

// export default Page;
