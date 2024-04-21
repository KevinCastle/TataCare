import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-tl from-blue-900 via-blue-500 to-cyan-400">
      <article className="container mx-auto min-h-screen">
        <Image
          src="/logo/care.png"
          width={128}
          height={128}
          alt="Picture of the author"
        />
        <section className="grid grid-rows-3 grid-flow-col grid-cols-1 h-screen">
          <div className="row-span-2 flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-white">Tatacare</h1>
            <p className="text-lg text-white">Una app para cuidar a los tatas</p>
          </div>
          <div className="row-span-1 flex items-center">
            <button type="button" className="py-3 px-5 rounded-lg bg-blue-950 text-white font-bold">Empezar</button>
          </div>
        </section>
      </article>
      <Image
        src="/backgrounds/invalid-caregiver.webp"
        width={500}
        height={500}
        alt="Picture of the author"
      />
    </main>
  );
}
