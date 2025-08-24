import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { StickyNavbar } from '../../shared/ui/layout/StickyNavbar';
import Footer from '../../shared/ui/layout/Footer';
import { routes } from './routes';

// Helper function to render routes, including nested ones
const renderRoutes = (routesConfig) => {
  return routesConfig.map((route, index) => (
    <Route key={index} path={route.path} element={<route.component />}>
      {route.children && renderRoutes(route.children)} {/* Recursively render children */}
    </Route>
  ));
};

function AppRouter() {
  return (
    <>
      <StickyNavbar />
      <Routes>
        {renderRoutes(routes)}
      </Routes>
      <Footer />
    </>
  );
}

export default AppRouter;
