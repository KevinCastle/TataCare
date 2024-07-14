<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" fill="#006FEE" viewBox="0 0 256 256"><path d="M164.38,181.1a52,52,0,1,0-72.76,0,75.89,75.89,0,0,0-30,28.89,12,12,0,0,0,20.78,12,53,53,0,0,1,91.22,0,12,12,0,1,0,20.78-12A75.89,75.89,0,0,0,164.38,181.1ZM100,144a28,28,0,1,1,28,28A28,28,0,0,1,100,144Zm147.21,9.59a12,12,0,0,1-16.81-2.39c-8.33-11.09-19.85-19.59-29.33-21.64a12,12,0,0,1-1.82-22.91,20,20,0,1,0-24.78-28.3,12,12,0,1,1-21-11.6,44,44,0,1,1,73.28,48.35,92.18,92.18,0,0,1,22.85,21.69A12,12,0,0,1,247.21,153.59Zm-192.28-24c-9.48,2.05-21,10.55-29.33,21.65A12,12,0,0,1,6.41,136.79,92.37,92.37,0,0,1,29.26,115.1a44,44,0,1,1,73.28-48.35,12,12,0,1,1-21,11.6,20,20,0,1,0-24.78,28.3,12,12,0,0,1-1.82,22.91Z"></path></svg>

<h2 align="center">Tatacare</h2>
  <p align="center">
    Cuidar a tus seres queridos nunca fue tan fácil.
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Tabla de contenidos</summary>
  <ol>
    <li>
      <a href="#about-the-project">Acerca del proyecto</a>
      <ul>
        <li><a href="#built-with">Stack de desarrollo</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Cómo empezar</a>
      <ul>
        <li><a href="#prerequisites">Prerequisitos</a></li>
        <li><a href="#installation">Instalación</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## Acerca del proyecto


Tatacare inicia como  un proyecto de grado enfocado a ayudar a familiares y cuidadores a poder llevar un registro de sus adultos mayores, buscando facilitarles el pesado trabajo que puede ser llevar el control de todo. Con Tatacare se busca que se pueda tener un registro de todos los datos importantes que se necesitan en cualquier momento, es una plataforma para dejar todo lo que se pueda olvidar facilmente como fechas, contactos y otros. Hacer un traspaso de los cuidados que necesita un adulto mayor a un cuidador será muy fácil utilizando Tatacare puesto que cualquier duda se puede consultar la app y a la vez se pueden dejar comentarios para los otros usuarios de manera que siempre haya un registro de información.

Entre las funcionalidades que tiene la app están:
1. Registro de medicamentos con fechas, farmacias donde conseguir, dosis y la condición destinada.
2. Registro de contactos de emergencia como doctores, clínica y familiares.
3. Registro de qué cosas le gustan, qué cosas no le gustan y qué cosas hay que evitar porque le hace mal.
4. Comentarios calificando el día.

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>



### Stack de desarrollo

Es una aplicación web, con la finalidad de que se pueda utilizar tanto en teléfonos como en computadores, que sea accesible para todo tipo de usuario. Teniendo eso en cuenta para su creación se utilizaron las siguientes herramientas:

* ![Vercel][vercel]
* ![Next][Next.js]
* ![React][React.js]
* ![TypeScript][typescript]
* ![Tailwind][tailwind.css]
* ![NextUI][nextui]
* ![PostgreSQL][postgresql]


<p align="right">(<a href="#readme-top">volver arriba</a>)</p>



<!-- GETTING STARTED -->
## Cómo empezar

Para crear una cuenta basta con ir a la [página principal](https://tata-care.vercel.app/) y darle click a botón de empezar.

Ahora, para abrir el repositorio en un entorno de desarrollo puede seguir los siguientes pasos.

### Prerequisitos

Se necesita usar NPM para levantar el proyecto:
* npm
  ```sh
  npm install npm@latest -g
  ```

Además, en [Vercel](vercel-url) es necesario crear una base de datos PostgreSQL y una base de datos Blob

### Instalación

1. Clona el repositorio
   ```sh
   git clone https://github.com/KevinCastle/TataCare.git
   ```
2. Instala el proyecto
   ```sh
   npm install
   ```
3. Introduce tu API key en un archivo .env
   ```js
   POSTGRES_URL="{{API_key}}"
    BLOB_READ_WRITE_TOKEN="{{Blob token}}"
    . . .
   ```
4. Lanza la app
   ```sh
   npm run dev
   ```

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [ ] Login con Google
- [ ] Modo offline y que pueda mandar notificaciones
- [ ] Poder descargar ficha en PDF
- [ ] Editar usuarios y poder subir fotos de perfil

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->

<!-- Contributors -->
[contributors-shield]: https://img.shields.io/github/contributors/KevinCastle/TataCare.svg?style=for-the-badge
[contributors-url]: https://github.com/KevinCastle/TataCare/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/KevinCastle/TataCare.svg?style=for-the-badge
[forks-url]: https://github.com/KevinCastle/TataCare/network/members
[stars-shield]: https://img.shields.io/github/stars/KevinCastle/TataCare.svg?style=for-the-badge
[stars-url]: https://github.com/KevinCastle/TataCare/stargazers

<!-- External -->
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/kevin-castillo11/
[web-site]: https://tata-care.vercel.app/
[vercel-url]: https://vercel.com/home

<!-- Issues -->
[issues-shield]: https://img.shields.io/github/issues/KevinCastle/TataCare.svg?style=for-the-badge
[issues-url]: https://github.com/KevinCastle/TataCare/issues

<!-- Build with -->
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[typescript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[tailwind.css]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[postgresql]: https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white
[vercel]: https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white
[nextui]: https://img.shields.io/badge/nextui-000000?style=for-the-badge&logo=nextui&logoColor=white