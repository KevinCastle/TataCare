'use client';

import {
  Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button,
  Image,
  Accordion,
  AccordionItem,
  CardBody,
  Card,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  ChatCircle, Heartbeat, Pill, Siren,
} from '@phosphor-icons/react/dist/ssr';
import Logo from './components/logo';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const menuItems = [
    { title: 'Características', id: 'features', href: '#features' },
    { title: 'Funcionalidades', id: 'functionalities', href: '#functionalities' },
    { title: 'Preguntas frecuentes', id: 'frecuently-asked-questions', href: '#frecuently-asked-questions' },
  ];

  const features = [
    {
      title: 'Control de Medicamentos', description: 'Lleva un registro detallado de los medicamentos, asegurando que nunca se pierda una dosis importante.', icon: Pill, color: '#7828C8',
    },
    {
      title: 'Detalles de Salud', description: 'Guarda y accede fácilmente a información vital sobre la salud de tus seres queridos  para ofrecer un cuidado más informado y efectivo.', icon: Heartbeat, color: '#F31260',
    },
    {
      title: 'Contactos de Emergencia', description: 'Mantén siempre a mano la información de contacto de emergencia, brindándote tranquilidad y seguridad.', icon: Siren, color: '#17C964',
    },
    {
      title: 'Comentarios y Notas', description: 'Añade notas personalizadas y comentarios sobre los gustos y necesidades diarias, asegurando un cuidado más humano y personalizado.', icon: ChatCircle, color: '#F5A524',
    },
  ];

  const functionalities = [
    {
      title: 'Lista de abuelitos',
      description: 'En la pantalla principal podrás ver la lista de abuelitos que tienes registrados. Puedes agregar, editar, compartir o eliminar abuelitos.',
      image: 'https://qjsik5ugffyu4v6q.public.blob.vercel-storage.com/landing/list-W7C9FjhILut4Ifm3kBiZzAE46NvFLl.png',
    },
    {
      title: 'Ficha resumen',
      description: 'En la pantalla principal encontrarás un resumen de los datos más importantes y otros que desees colocar como favoritos. Entre los datos está la información legal, contactos de emergencia, tipo de sangre y alergias',
      image: 'https://qjsik5ugffyu4v6q.public.blob.vercel-storage.com/landing/card-9k6IcLTyF5EpVr8qnhpRlWhvAdds7I.png',
    },
    {
      title: 'Medicamentos',
      description: 'Tendrás un registro de los medicamentos que debe tomar y para qué condición, así como también la dosis, la frecuencia, el horario y sabrás si ya ha terminado el tratamiento.',
      image: 'https://qjsik5ugffyu4v6q.public.blob.vercel-storage.com/landing/medicine-Ts2HPklvPTdlXYAy7rIvadqXWlPgaQ.png',
    },
    {
      title: 'Contactos de emergencia',
      description: 'En la ficha de contactos de emergencia podrás llevar un registro de los contactos de emergencia del abuelito, como familiares, amigos o vecinos.',
      image: 'https://qjsik5ugffyu4v6q.public.blob.vercel-storage.com/landing/contacts-qFwtY14MPuIVyjAj6MP0pPuI6Igmh5.png',
    },
    {
      title: 'Gustos y preferencias',
      description: 'En la sección de gustos y preferencias podrás llevar un registro de los gustos y preferencias, categorizando en qué le gusta, qué no le gusta y qué se debe evitar. De esta manera compartir la información será más sencillo y se evitará problemas.',
      image: 'https://qjsik5ugffyu4v6q.public.blob.vercel-storage.com/landing/tastes-ESs0QUel0DkfYwmSgiisIp0kE438bd.png',
    },
    {
      title: 'Comentarios y notas',
      description: 'Cada día o cuando más lo requiera puede dejar comentarios y notas con calificaciones necesarias para poder armar un registro de cómo estuvo el día y que sus otros familiares puedan verlo.',
      image: 'https://qjsik5ugffyu4v6q.public.blob.vercel-storage.com/landing/comments-KRq2qSodewxLxdNFnDsdRiIMXIm5Nk.png',
    },
  ];

  const frecuentlyAskedQuestions = [
    {
      question: '¿Es Tatacare gratis?',
      answer: 'Al ser un proyecto con la finalidad de ayudar a las personas, Tatacare es completamente gratis.',
    },
    {
      question: '¿Tatacare es compatible con dispositivos móviles?',
      answer: 'Sí, Tatacare es una aplicación web, por lo que puedes tener acceso a ella desde cualquier dispositivo con conexión a internet.',
    },
    {
      question: '¿Puedo compartir el cuidado con otros familiares?',
      answer: 'Sí, puedes compartir el acceso con familiares para que todos puedan colaborar en el cuidado de los abuelitos de manera coordinada.',
    },
    {
      question: '¿Cómo garantizan la privacidad de la información?',
      answer: 'Tatacare cumple con los estándares de seguridad y privacidad de la información, garantizando que los datos de tus seres queridos estén seguros y protegidos; Los datos suministrados son sólo para uso privado de cada usuario.',
    },
    {
      question: '¿Es necesario tener conexión a Internet para usar Tatacare?',
      answer: 'Sí, es necesario tener conexión a internet para poder acceder a la aplicación y llevar un registro actualizado del cuidado de tus seres queridos.',
    },
  ];

  return (
    (
      <main className="">
        <Navbar onMenuOpenChange={setIsMenuOpen} shouldHideOnScroll maxWidth="2xl">
          <NavbarContent>
            <NavbarMenuToggle
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              className="sm:hidden"
            />
            <NavbarBrand>
              <Logo iconColor="#006FEE" />
            </NavbarBrand>
          </NavbarContent>

          <NavbarContent className="hidden sm:flex gap-4" justify="center">
            {menuItems.map((item) => (
              <NavbarItem key={item.id}>
                <Link href={item.href} color="foreground">
                  {item.title}
                </Link>
              </NavbarItem>
            ))}
          </NavbarContent>
          <NavbarContent justify="end">
            <NavbarItem>
              <Button as={Link} color="primary" href="/app" variant="flat" onPress={() => router.push('/app')}>
                Probar ahora
              </Button>
            </NavbarItem>
          </NavbarContent>
          <NavbarMenu>
            {menuItems.map((item) => (
              <NavbarMenuItem key={`${item.id}-mobile`}>
                <Link
                  className="w-full"
                  href={item.href}
                  size="lg"
                  color="foreground"
                >
                  {item.title}
                </Link>
              </NavbarMenuItem>
            ))}
          </NavbarMenu>
        </Navbar>
        <article className="lg:h-[547px] bg-zinc-50">
          <section className="grid grid-cols-12 h-full">
            <div className="hidden lg:flex col-span-7 container flex-col justify-center">
              <h1 className="text-5xl text-pretty text-zinc-900">Cuidar a tus seres queridos nunca fue tan fácil.</h1>
              <h2 className="text-lg font-medium my-4 text-pretty">
                Lleva un registro detallado y personalizado en un sólo lugar donde la información nunca falte.
              </h2>
              <Button type="button" color="primary" size="lg" className="w-fit" onPress={() => router.push('/app')}>
                Empieza ahora
              </Button>
            </div>
            <div className="hero-background col-span-12 lg:col-end-13 lg:col-span-4 lg:flex lg:items-end h-full">
              <div className="hidden lg:block relative -left-32">
                <Image src="https://qjsik5ugffyu4v6q.public.blob.vercel-storage.com/landing/hero-grandpa-rKkmgjxxzqqBIX5hDZdA3BDhM6IZry.png" alt="Abuelo con su nieto" width={519} height={513} />
              </div>
              <div className="block lg:hidden container py-6">
                <h1 className="text-5xl text-pretty text-zinc-900">Cuidar a tus seres queridos nunca fue tan fácil.</h1>
                <h2 className="text-lg font-medium my-4 text-pretty text-zinc-900">
                  Lleva un registro detallado y personalizado en un sólo lugar donde la información nunca falte.
                </h2>
                <Button type="button" color="primary" size="lg" className="w-fit" onPress={() => router.push('/app')}>
                  Empieza ahora
                </Button>
              </div>
            </div>
          </section>
        </article>
        <article id="features" className="bg-blue-50">
          <section className="container grid grid-cols-1 lg:grid-cols-4 gap-4 py-14">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div className="col-span-1 flex lg:flex-col" key={feature.title.replaceAll(' ', ',')}>
                  <div className="mr-3">
                    <Icon size={48} color={feature.color} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold my-2">{feature.title}</h2>
                    <p className=" text-zinc-800 text-pretty">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </section>
        </article>
        <article id="functionalities" className="logo-background">
          <section className="container py-14">
            <div className="text-center mb-6">
              <h2 className="text-3xl text-zinc-100 font-semibold">Funcionalidades</h2>
              <p className="text-lg text-zinc-100 text-pretty mt-4">Con Tatacare, lleva un registro detallado y personalizado del cuidado de tus seres queridos.</p>
            </div>
            {functionalities.map((functionality, index) => (
              <Card
                isBlurred
                className="border-none bg-background/10 p-4 max-w-[1024px] mx-auto mb-6"
                shadow="sm"
                key={functionality.title.replaceAll(' ', '-')}
              >
                <CardBody>
                  <div className="grid grid-cols-5 gap-6">
                    <div className={`col-span-5 lg:col-span-3 mx-auto lg:mx-0 ${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2 lg:ml-auto'}`}>
                      <Image src={functionality.image} alt={functionality.title} />
                    </div>
                    <div className={`col-span-5 lg:col-span-2 text-white ${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                      <p className="text-2xl font-semibold pb-4">{functionality.title}</p>
                      <p className="text-lg">
                        {functionality.description}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </section>
        </article>
        <article id="frecuently-asked-questions" className="bg-blue-200">
          <section className="container lg:grid lg:grid-cols-12 py-14">
            <div className="lg:col-start-2 lg:col-end-12 rounded-xl bg-zinc-50 px-8 py-10">
              <p className="text-3xl text-zinc-900 font-semibold text-center">Preguntas frecuentes</p>
              <Accordion>
                {frecuentlyAskedQuestions.map((faq) => (
                  <AccordionItem key={faq.question.replaceAll(' ', '-')} aria-label={faq.question} title={faq.question}>
                    <p className="text-zinc-800 text-pretty">{faq.answer}</p>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        </article>
        <footer>
          <section className="container py-14">
            <div className="text-center">
              <h2 className="text-3xl text-zinc-900 font-semibold">¿Listo para empezar?</h2>
              <p className="text-lg text-zinc-900 text-pretty mt-4">Regístrate y empieza a cuidar a tus seres queridos de una manera más fácil y segura.</p>
              <Button type="button" color="primary" size="lg" className="w-fit mt-6" onPress={() => router.push('/app')}>
                Empieza ahora
              </Button>
            </div>
          </section>
        </footer>
      </main>
    )
  );
}
