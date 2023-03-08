import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { Outlet, NavLink } from 'react-router-dom';

import './Root.css';

const activeNavLink = ({ isActive }) =>
  (isActive && 'nav-link nav-link-active') || 'nav-link';

function Root() {
  return (
    <div className="d-flex flex-row">
      <Nav className="sidebar" defaultActiveKey="/home">
        <NavLink className={activeNavLink} to={'/tasks'}>
          Tareas
        </NavLink>
        <NavLink className={activeNavLink} to={'/new-task'}>
          Nueva Tarea
        </NavLink>
      </Nav>
      <div className="container-fluid">
        <Outlet />
      </div>
    </div>
  );
}

export default Root;
