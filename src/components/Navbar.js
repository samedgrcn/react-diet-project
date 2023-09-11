import userlogo from "./user-icon.png";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ currentUser, handleLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Burada karanlık mod ve gündüz moduna geçiş için gerekli işlemleri yapabilirsiniz.
  };

  return (
    <nav 
    currentUser={currentUser}
    handleLogout={handleLogout}
    className={`navbar ${darkMode ? "dark-mode" : "light-mode"}`}>
      <div className="navbar-logo">
        Diyetisyen Uygulaması
      </div>
      
      <ul className="navbar-menu">
      {currentUser ? (
  <>
    {currentUser.email === "sam@gmail.com" ? (
      <li className="navbar-item">
        <Link to="/admin-dashboard" className="navbar-link">
          Yönetim Paneli
        </Link>
      </li>
    ) : (
      <>
        <li className="navbar-item">
          <Link to="/doctor-dashboard" className="navbar-link">
            Ana Sayfa
          </Link>
        </li>
        <li className="navbar-item">
          <Link to="/appointments" className="navbar-link">
            Randevular
          </Link>
        </li>
        <li className="navbar-item">
          <Link to="/meals" className="navbar-link">
            Yemekler
          </Link>
        </li>
        <li className="navbar-item">
          <Link to="/consultations" className="navbar-link">
            Görüşmeler
          </Link>
        </li>
        <li className="navbar-item">
          <Link to="/clients" className="navbar-link">
            Danışanlar
          </Link>
        </li>
      </>
    )}
    <span className="navbar-item">{currentUser?.email}</span>
  </>
) : (
  <li className="navbar-item">
    <Link to="/" className="navbar-link">
      Giriş Yap
    </Link>
  </li>
)}
      </ul>
      
      <div className="navbar-user" onClick={toggleDropdown}>
      {currentUser?.email && (
               <img
               src={userlogo} // Burada kullanıcı logosunun olduğu bir resim dosyasının yolunu belirtmelisiniz.
               alt="User"
               className="user-icon"
             />
            )}
       
        {showDropdown && (
          <ul className="dropdown-menu">

          {currentUser.email === "sam@gmail.com" ? (
          <>
            <li className="dropdown-item">
              <Link to="/account-settings" className="dropdown-link">
                Hesap Ayarları
              </Link>
            </li>
            <li className="dropdown-item">
              <Link onClick={toggleDarkMode} className="dropdown-link ">
                {darkMode ? "Gündüz Modu" : "Karanlık Mod"}
              </Link>
            </li>
            <li className="dropdown-item">
              <Link to="/" onClick={handleLogout} className="dropdown-link">
                Çıkış Yap
              </Link>
            </li>  
          </>
          ): ( currentUser?.email && (
            <>
          <li className="dropdown-item">
            <Link to="/profile" className="dropdown-link">
              Profili Düzenle
            </Link>
          </li>
          <li className="dropdown-item">
              <Link to="/account-settings" className="dropdown-link">
                Hesap Ayarları
              </Link>
            </li>
            <li className="dropdown-item">
              <Link onClick={toggleDarkMode} className="dropdown-link ">
                {darkMode ? "Gündüz Modu" : "Karanlık Mod"}
              </Link>
            </li>
            <li className="dropdown-item">
              <Link to="/" onClick={handleLogout} className="dropdown-link">
                Çıkış Yap
              </Link>
            </li>
            </>
          ))}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;