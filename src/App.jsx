import "./App.css";
import Footer from "./Components/Footer.jsx";
import { HomeContainer } from "./Components/HomeContainer.jsx";
import NavbarComponent from "./Components/NavbarComponent.jsx";
import { NavbarSimple } from "./Components/NavbarSimple.jsx";
import StickyNavbar from "./Components/StickyNavbar.jsx";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <StickyNavbar />
      <main className="flex-grow bg-white">
        <HomeContainer />
      </main>
      <Footer /> 
    </div>
  );
}

export default App;
