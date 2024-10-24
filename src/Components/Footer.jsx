import React from "react";
import styles from '../Components/Styles/Footer.module.css'
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
      <>
        <div className={styles.bar}>
          <Link to='https://es-la.facebook.com/'>
            <img
              src='../images/ico-facebook.png'
              alt='iconFacebook'
              className={styles.socialneticon}
            /></Link>
          <Link to='https://www.instagram.com/'>
            <img
              src='../images/ico-instagram.png'
              alt='iconInsta'
              className={styles.socialneticon}
            /></Link>
          <Link to='https://web.whatsapp.com/'>
            <img
              src='../images/ico-whatsapp.png'
              alt='iconWhatsapp'
              className={styles.socialneticon}
            /></Link>
        </div>
      </>
    );
  };
  
  export default Footer
  