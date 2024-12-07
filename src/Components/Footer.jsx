import React from "react";
import styles from '../Components/Styles/Footer.module.css'
import { Link } from 'react-router-dom';

const Footer = () => {
  const baseUrl = import.meta.env.BASE_URL;
    return (
      <footer className={styles.footer}>
        <div className={styles.bar}>
          <div className={styles.logoAndText}>
            <h1>
              MOVELT
            </h1>
            <div className={styles.footerText}>
              <h2>@2024 Digital Booking</h2>
              <h3>Proyecto Integrador - Grupo 4</h3>
            </div>
          </div>
          <div className={styles.socialLinks}>
            <Link to='https://www.instagram.com/'>
              <img
                src={`${baseUrl}images/ico-instagram.png`}
                alt='iconInsta'
                className={styles.socialneticon}
              /></Link>
            <Link to='https://es-la.facebook.com/'>
              <img
                src={`${baseUrl}images/ico-facebook.png`}
                alt='iconFacebook'
                className={styles.socialneticon}
              /></Link>
            <Link to='https://x.com/'>
              <img
                src={`${baseUrl}images/ico-x.png`}
                alt='iconX'
                className={styles.socialneticon}
              /></Link>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer
