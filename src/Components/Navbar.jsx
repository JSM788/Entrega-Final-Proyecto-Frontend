import React from 'react';
import styles from './Styles/Navbar.module.css'; // Importando los estilos personalizados

function Navbar() {
  return (
    <>
    <header className={styles.navbar}>
      <div className={styles.logo}>MOVELT</div>
      <nav className={styles.navbarLinks}>
        <a href="#">Label NavBar</a>
        <a href="#">Label NavBar</a>
        <a href="#">Label NavBar</a>
      </nav>
      <div className={styles.navbarActions}>
        <button className={styles.loginButton}>Inicia Sesión</button>
        <button className={styles.registerButton}>Regístrate</button>
      </div>
    </header>
    </>
  )
}

export default Navbar
