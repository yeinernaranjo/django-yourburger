import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar.jsx";
import { Table } from "../components/Table/Table.jsx";

import { Button } from "../components/Form/Button.jsx";
import { Input } from "../components/Form/Input.jsx";

import { Modal } from "../components/Modal.jsx";

// CONEXION CON LA API DE USERS Y ROLES
import {
  getUsers,
  createUser,
  deleteUser,
  getUser,
  editUser,
} from "../api/clients.api.js";
import { getRoles } from "../api/roles.api";

export function ClientPage() {
  // ARREGLO DE USUARIOS Y ROLES
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  //
  const [isOpen, setIsOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    fields: [],
  });

  const openModal = (title, fields, dataSelect, submit) => {
    setModalConfig({ title, fields, dataSelect, submit });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  // Objeto para los campos de la ventana modal
  const fieldsNew = [
    {
      title: "Usuario",
      type: "text",
      name: "username",
      icon: "user",
      col: "half",
      required: "true",
    },
    {
      title: "Email",
      type: "text",
      name: "email",
      icon: "envelope",
      col: "half",
      required: "true",
    },
    {
      title: "Contraseña",
      type: "password",
      name: "password",
      icon: "key",
      col: "half",
      value: "yourburger123",
      readonly: "true",
    },
    { title: "Rol", type: "select", name: "role", col: "half" },
  ];

  // Conexion a API y obtiene datos de Users y Roles
  useEffect(() => {
    async function fetchData() {
      const res = await getUsers();
      const resRoles = await getRoles();
      setUsers(res.data);
      setRoles(resRoles.data);
    }

    fetchData();
  }, []);

  const handleCreateUser = async (data) => {
    try {
      await createUser(data);
      window.location.reload();
    } catch (error) {
      console.error("Error al crear el usuario:", error);
    }
  };

  const handleEditClick = async (userId) => {
    const res = await getUser(userId);
    const user = res.data;

    const fieldsEdit = [
      {
        title: "Usuario",
        type: "text",
        name: "username",
        icon: "user",
        col: "half",
        required: "true",
        value: user.username,
      },
      {
        title: "Email",
        type: "text",
        name: "email",
        icon: "envelope",
        col: "half",
        required: "true",
        value: user.email,
      },
      {
        title: "Rol",
        type: "number",
        name: "role",
        col: "half",
        value: user.role,
      },
    ];

    const handleEditUser = async (data) => {
      try {
        await editUser(userId, data);
        window.location.reload();
      } catch (error) {
        console.error("Error al editar el usuario:", error);
      }
    };

    openModal("Editar usuario", fieldsEdit, roles, handleEditUser);
  };

  const handleDeleteClick = (userId) => {
    deleteUser(userId);
    window.location.reload();
  };

  return (
    <div>
      <Navbar />
      <div className="container is-fluid mt-5">
        <div className="columns is-centered">
          <div className="column is-fullwidth">
            <Button
              text="Crear Cliente +"
              color="success"
              col="fullwidth"
              action={() =>
                openModal("Nuevo Cliente", fieldsNew, roles, handleCreateUser)
              }
            />
          </div>
          <div className="column is-9">
            <Input holder="Buscar usuario" icon="magnifying-glass" />
          </div>
          <div className="column is-fullwidth">
            <Button text="Generar PDF" color="primary" col="fullwidth" />
          </div>
        </div>
        <Table
          headers={["id",  "username", "email", "date"]}
          columns={["ID", "Usuario", "Correo", "Creado en"]}
          data={users}
          status
          edit
          delete
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
        />
      </div>
      {isOpen && (
        <Modal
          title={modalConfig.title}
          fields={modalConfig.fields}
          dataSelect={modalConfig.dataSelect}
          onClose={closeModal}
          submit={modalConfig.submit}
        />
      )}
    </div>
  );
}