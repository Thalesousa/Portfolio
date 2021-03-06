import { AiFillLinkedin, AiFillGithub, AiFillCodepenCircle } from 'react-icons/ai'
import { GrMail } from 'react-icons/gr'
import styles from './styles.module.scss';

interface FooterProps {
  year: string;
}

export function Footer({ year }: FooterProps) {
  return (
    <footer className={styles.Footer}>

      <span>E ai, vamos trabalhar juntos? <span>😃</span></span>
      <ul>
        <li><span>&#169;{year} Thales Sousa</span></li>
        <li><a href="https://www.linkedin.com/in/thalesousa/"><AiFillLinkedin /></a></li>
        <li><a href="https://github.com/Thalesousa"><AiFillGithub /></a></li>
        <li><a href="https://codepen.io/thalesousa"><AiFillCodepenCircle /></a></li>
        <li><a href="mailto:thalestjsb@gmail.com" ><GrMail /></a></li>
      </ul>
    </footer>
  )
}