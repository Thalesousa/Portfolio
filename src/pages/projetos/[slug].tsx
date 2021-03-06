import { GetStaticProps, GetStaticPaths } from "next"
import Head from 'next/head';
import Link from 'next/link'

import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";

import { format, parseISO } from 'date-fns';
import  ptBR  from 'date-fns/locale/pt-BR';

import { api } from "../../services/api"
import slug from './slug.module.scss'
import { AiFillGithub } from 'react-icons/ai'
import { FaGlobeAmericas } from 'react-icons/fa'
import { UseRepositories } from "../../hooks/UseRepositories";

interface ProjectProps {
  repository: {
    title: string,
    name: string,
    description: string,
    homepage: string,
    languages: Array<string>[],
    github: string,
    createdAt: string,
    imgPreview: string,
  },
  year: string,
}

interface Repository {
  id: number;
  name: string;
  title: string;
  thumbnail: string;
  created_at: string;
  default_branch: string;
}

export default function Project({repository, year}: ProjectProps) {
  return (
    <>
      <Head>
        <title>{repository.title} | Thalesousa</title>
      </Head>
      <Header />
      
      <main>
        <section className={slug.Project}>
          <h1 translate="no">{repository.title}</h1>
            <span>Criado em: {repository.createdAt}</span>

            <div className={slug.Description}>
              <span translate="no">{repository.title}</span>
              <span>{repository.description}</span>
            </div>

            <div className={slug.Links}>
              {repository.homepage && <Link href={repository.homepage}><a><FaGlobeAmericas /> <span translate="no"> Site </span></a></Link>}
              
              <Link href={repository.github}><a><AiFillGithub /> <span> Repositório </span></a></Link>
            </div>

            <section className={slug.Languages}>
              <h2>Linguagens</h2>
              <ul>
              {repository.languages.map((language, index) => (
                <li key={index}>{language}</li>
              ))}
              </ul>
              
            </section>

            <img src={repository.imgPreview} alt={`${repository.title} imagem de capa`} />

            
        </section>
      </main>

      <Footer year={year}/>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const repositories: Promise<Repository[]> = UseRepositories();

  const latestRepositories = (await repositories).slice(0, 4);
  
  const paths = latestRepositories.map(repository => {
    return {
      params: {
        slug: repository.name
      }
    }
  })
  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const year = new Date().getFullYear();

  const { slug } = context.params as any;
  try {
    const { data } = await api.get(`repos/Thalesousa/${slug}`);
    const languages = await api.get(`repos/Thalesousa/${slug}/languages`);

    const repository = {
      title: data.name.replace("-", " "),
      name: data.name,
      description: data.description,
      homepage: data.homepage,
      languages: Object.keys(languages.data),
      github: data.html_url,
      createdAt: format(parseISO(data.created_at), 'dd/MM/yyyy', { locale: ptBR }),
      imgPreview: `https://raw.githubusercontent.com/Thalesousa/${data.name}/port/.github/expand.png`,
    }

    return {
      props: {
        repository,
        year
      },
      revalidate: 60 * 60 * 24 * 3,
    }

  }catch{
    return {
      notFound: true,
    }
  }
}