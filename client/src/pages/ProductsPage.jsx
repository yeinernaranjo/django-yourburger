// GENERACION DE PDF
import jsPDF from "jspdf";
import "jspdf-autotable";

import Logo from "../assets/img/Logo.png"; // Imagen que sera usada en el PDF

import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar.jsx";
import { ViewP } from "../components/ViewP.jsx";
import { Button } from "../components/Form/Button.jsx";
import { Input } from "../components/Form/Input.jsx";
import { Modal } from "../components/Modal.jsx";
import { Table } from "../components/Table/Table.jsx";
import { Notification } from "../components/Notification.jsx";


import { useRef } from "react";

import Cookies from "js-cookie";

// CONEXION CON LA API DE USERS Y ROLES
import {
  getProducts,
  createProduct,
  deleteProduct,
  getProduct,
  editProduct,
  updateProductStatus,
} from "../api/products.api.js";
import { getSupplies, getSupplie, getSupplieName } from "../api/supplies.api.js";
import { createContent, deleteContent, editContent, getContents } from "../api/content.api.js";

// import {createContent} from "../api/"

export function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [contents, setContents] = useState([]);
  const [order, setOrder] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);
  const [ingredientes1, setIngredientes1] = useState([]);

  const ingredientesPrueba = useRef([]);
  const selectedOptionRef = useRef();

  //Generar PDF
  const generatePDF = async () => {
    const doc = new jsPDF();

    doc.addFont("helvetica", "normal");
    const fontSize = 10;

    const headers = [
      "#",
      "Nombre",
      "Precio",
      "Descripcion",
    ];
    const tableData = await Promise.all(
      products.map(async (product, index) => [
        index + 1,
        product.name,
        product.price,
        product.description,

      ])
    );

    doc.setFont("helvetica");
    doc.setFontSize(fontSize);
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 40,
      styles: {
        textColor: [100, 100, 100],
        lineColor: [100, 100, 100],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [207, 41, 36],
        textColor: [255, 255, 255],
      },
      bodyStyles: {
        fillColor: [245, 245, 245],
      },
    });

    const imgData = Logo;
    doc.addImage(imgData, "PNG", 10, 10, 30, 30);

    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(`REPORTE DE PRODUCTOS`, 50, 25);

    const today = new Date();
    const dateStr = today.toLocaleDateString();

    doc.setFontSize(fontSize);
    doc.setFont("helvetica", "normal");
    doc.text(`Fecha: ${dateStr}`, 50, 30);

    doc.save("reporte_productos.pdf");
  };

  const [isOpen, setIsOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState();
  const [notification, setNotification] = useState(null);


  // Variable para buscar productos


  useEffect(() => {
    const currentIngredients = ingredientes;
    const storedDetail = Cookies.get("orderDetail");
    if (storedDetail) {
      setOrder(JSON.parse(storedDetail));
    }
  }, [ingredientes]);

  const reloadDataTable = async () => {
    setProducts([]);

    setContents([]);
    setIngredientes([]);
    setIngredientes1([]);
    const res = await getContents();
    // Obtiene una matriz de promesas que resuelven los nombres de los roles
    const rolePromises = res.data.map((user) => getSupplieName(user.supplies));

    // Espera a que todas las promesas se resuelvan
    const roleNames = await Promise.all(rolePromises);

    // Combina los datos de usuario con los nombres de roles resueltos
    const usersWithRoles = res.data.map((user, index) => ({
      ...user,
      name: roleNames[index],
    }));
    setContents(usersWithRoles);
    const resProduct = await getProducts();
    setProducts(resProduct.data)
  };

  const handleOptionChange = (event) => {
    const option = supplies.find(
      (supplie) => supplie.name === event.target.value,
    );
    selectedOptionRef.current = option;
  };
  const handleOptionChange1 = (event) => {
    const option = supplies.filter(
      (supplie) => supplie.id === parseInt(event.target.value),
    );
    selectedOptionRef.current = option[0];
  };
  //tal vez editar
  const anadirIngrediente = () => {
    if (selectedOptionRef.current != undefined) {
      ingredientes.push(selectedOptionRef.current);
      setIngredientes([...ingredientes]); // Actualiza el estado de ingredientes
    } else {
      console.log("error al añadir");
    }
  };


  const openModal = (
    title,
    fields,
    dataSelect,
    nameSelect,
    buttonSubmit,
    submit
  ) => {
    if (nameSelect === "supplies") {
      dataSelect = supplies.map((supplie) => ({
        value: supplie.id,
        label: supplie.name,
      }));
    }

    setModalConfig({
      title,
      fields,
      dataSelect,
      nameSelect,
      buttonSubmit,
      submit,
    });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    reloadDataTable()
  };

  const fieldsNew = [
    {
      title: "Producto",
      type: "text",
      name: "name",
      icon: "burger",
      col: "half",
      required: "true",
    },
    {
      title: "Precio",
      type: "number",
      name: "price",
      icon: "dollar",
      col: "half",
      required: "true",
    },
    {
      title: "Imagen",
      type: "file",
      name: "image",
      icon: "dollar",
      col: "half",
      require: true,
      multiple: false,
    },
    {
      title: "Descripción",
      type: "text",
      name: "description",
      icon: "comment",
      col: "half",
      required: "true",
    },
    {
      title: "Ingredientes",
      hasButton: true,
      textButton: "+",
      type: "select",
      name: "supplies",
      icon: "list",
      required: "false",
      col: "full",
      handleOptionChange: handleOptionChange,
      actionButton: anadirIngrediente,
    },
    {
      type: "list",
      columns: ['Nombre', 'Precio'],
      headers: ['name', 'price'],
      data: ingredientes,
      delete: true,
      //onDeleteClick: clickDelete
    },
  ];

  // Conexion a API y obtiene datos de Productos y contenido
  useEffect(() => {
    async function fetchData() {
      const resP = await getProducts();
      const res = await getContents();
      // Obtiene una matriz de promesas que resuelven los nombres de los roles
      const rolePromises = res.data.map((user) => getSupplieName(user.supplies));

      // Espera a que todas las promesas se resuelvan
      const roleNames = await Promise.all(rolePromises);

      // Combina los datos de usuario con los nombres de roles resueltos
      const usersWithRoles = res.data.map((user, index) => ({
        ...user,
        name: roleNames[index],
      }));
      setContents(usersWithRoles);
      setProducts(resP.data);
    }

    async function fetchSupplies() {
      const res = await getSupplies();
      setSupplies(res.data);
    }

    fetchSupplies();
    fetchData();
  }, []);



  const handleCreateProduct = async (data) => {
    try {
      // anadirIngrediente(data);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price);
      formData.append("description", data.description);
      formData.append("status", true);

      // Agrega cada archivo individualmente
      for (let i = 0; i < data.image.length; i++) {
        formData.append("image", data.image[i]);
      }

      const produc = await createProduct(formData);

      for (let index = 0; index < ingredientes.length; index++) {
        const ingrediente = ingredientes[index];
        const formData1 = new FormData();
        formData1.append("product", produc.data.id);
        formData1.append("supplies", ingrediente.id);
        formData1.append("count", 1);

        await createContent(formData1);
      }

      reloadDataTable();
      setIngredientes([]);
      closeModal();
      setNotification({
        msg: "Producto creado exitosamente!",
        color: "success",
        buttons: false,
        timeout: 3000,
      });
    } catch (error) {
      console.error("Error al crear el Producto:", error);
    }
  };

  const handleAddSupplies = () => {
    if (selectedOptionRef.current != undefined) {
      const res = selectedOptionRef.current
      const ingediente = {
        count: 1,
        products: "",
        supplies: res.id,
        name: res.name
      }
      ingredientes1.push(ingediente);
      setIngredientes1([...ingredientes1])
      console.log(ingredientes1);
    } else {
      console.log("error al añadir");
    }
  };
  const Combined = (content) => {
    const ingre = ingredientes1
    setIngredientes1([])
    content.map((object) => {
      ingre.push(object)
    })
    setIngredientes1([...ingre])
  }
  const handleEditClick = async (productId) => {
    const res = await getProduct(productId);
    const product = res.data;
    const content = contents.filter((content) => content.product == productId)
    Combined(content)
    const DeleteSuppplies = async (idSupplie) => {
      try {
        const contentIndex = content.filter((content) => content.supplies === idSupplie);
        console.log(contentIndex);
        if (contentIndex.length > 0) {
          await deleteContent(contentIndex[0].id)
        } else {
          const ingredienteIndex = ingredientes1.findIndex((ingrediente) => ingrediente.supplies === idSupplie);
          if (ingredienteIndex !== -1) {
            console.log(contentIndex);

            // El ID fue encontrado en el array ingredientes1
            ingredientes1.splice(ingredienteIndex, 1); // Eliminar el elemento del array ingredientes1
            setIngredientes1([...ingredientes1]); // Actualizar el estado para reflejar el cambio
          }
        }
      } catch (error) {
        console.log(error);
      }
    };


    const fieldsEdit = [
      {
        title: "Producto",
        type: "text",
        name: "name",
        icon: "burger",
        col: "half",
        required: "true",
        value: product.name,
      },
      {
        title: "Precio",
        type: "number",
        name: "price",
        icon: "dollar",
        col: "half",
        required: "true",
        value: product.price,
      },
      {
        title: "Imagen",
        type: "file",
        name: "image",
        icon: "image",
        col: "half",
        //value:product.image,   // Valor actual de la imagen del producto
        multiple: false,
      },
      {
        title: "Descripción",
        type: "text",
        name: "description",
        icon: "comment",
        col: "half",
        required: "true",
        value: product.description,
      },
      {
        type: "list",
        columns: ['Nombre'],
        headers: ['name'],
        data: ingredientes1,
        nameSelect: "name",
        keySelect: "supplies", // Use the combined array here
        delete: true,
        onDeleteClick: DeleteSuppplies
      },
      {
        title: "Ingredientes",
        hasButton: true,
        textButton: "+",
        type: "select",
        name: "supplies",
        icon: "list",
        required: "false",
        col: "full",
        customOptions: [{ "name": "no seleccionado", id: 0 }, ...supplies],
        nameSelect: "name",
        keySelect: "id",
        handleOptionChange: handleOptionChange1,
        actionButton: handleAddSupplies,
      },
    ];

    const handleEditProduct = async (data) => {
      console.log(data);
      const { id, name, price, image, description } = data;
      const product = await (await getProduct(productId)).data;
      const contentss = contents.filter(
        (content) => content.product === product.name
        //revisar
      );

      try {
        if (ingredientes1.length > 0) {
          for (let i = 0; i < ingredientes1.length; i++) {
            const element = ingredientes1[i];
            const suppli = {
              product: product.id,
              supplies: element.supplies,
              count: element.count
            }
            console.log(suppli);
            const contentIndex = content.filter((content) => content.supplies === suppli.supplies);
            if (contentIndex.length === 0) {
              await createContent(suppli)
              // await deleteContent(contentIndex[0].id)
            } 
            }
          }
          const updateData = new FormData();
          updateData.append("name", data.name);
          updateData.append("price", data.price);
          // Agrega cada archivo individualmente
          for (let i = 0; i < data.image.length; i++) {
            updateData.append("image", data.image[i]);
          }

          updateData.append("description", data.description);

          const res = await editProduct(productId, updateData);
          const updatedProduct = res.data;

          if (contentss.length > 0) {
            for (let i = 0; i < contentss.length; i++) {
              const content = contents[i];
              const updateContent = new FormData();
              updateContent.append("product", id);
              updateContent.append("supplies", content.supplies);
              updateContent.append("count", content.count);

              await editContent(content.id, updateContent);
            }
          }

          closeModal();
          reloadDataTable();
          setNotification({
            msg: "Producto editado exitosamente!",
            color: "warning",
            buttons: false,
            timeout: 3000,
          });

          // Actualizar la lista de productos sin recargar la página
          setProducts((prevProducts) => {
            const updatedProducts = prevProducts.map((product) => {
              if (product.id === productId) {
                // Actualizar los datos del producto editado
                return {
                  ...product,
                  name: name,
                  price: price,
                  image: updatedProduct.image, // Actualizar el campo "image" con la URL de la nueva imagen
                  description: description,
                  // Actualizar otros campos si es necesario
                };
              }
              return product;
            });
            return updatedProducts;
          });
        } catch (error) {
          console.error("Error al editar el Producto:", error);
        }
      };

      openModal(
        "Editar producto",
        fieldsEdit,
        products,
        "name",
        true,
        handleEditProduct
      );
    };

    const handleAddclick = async (product) => {
      const suppliesProduct = await contents.filter(
        (content) => content.product == product.id
        //revisar
      );
      const content = contents.filter((content) => content.product == product.id)
      //revisar

      const fieldsAdd = [
        {
          title: "Producto",
          type: "text",
          name: "name",
          icon: "burger",
          col: "half",
          required: "true",
          value: product.name,
          readonly: true,
        },
        {
          title: "Precio",
          type: "number",
          name: "price",
          icon: "dollar",
          col: "half",
          required: "true",
          value: product.price,
          readonly: true,
        },
        {
          title: "Imagen",
          type: "image",
          name: "image",
          icon: "dollar",
          col: "full",
          image: product.image,
        },
        {
          title: "Descripción",
          type: "text",
          name: "description",
          icon: "comment",
          col: "full",
          required: "true",
          value: product.description,
          readonly: true,
        },
        {
          title: "Ingredientes",
          hasButton: true,
          textButton: "+",
          type: "select",
          name: "supplies",
          icon: "list",
          required: "false",
          col: "full",
          customOptions: [
            { id: 0, name: "No seleccionado" },
            ...suppliesProduct,
          ],
          nameSelect: "name",

          // handleOptionChange: handleOptionChange,
          actionButton: anadirIngrediente,
        },
        {
          type: "list",
          columns: ['Nombre', 'Precio'],
          headers: ['name', 'price'],
          data: ingredientes,
          delete: true,
          //onDeleteClick: clickDelete
        },
      ];

      const handleAdd = (data) => {
        const { name, price, description } = data;
        const idP = products.filter((product) => product.name == name);
        //revisar
        console.log(idP[0].id);
        try {
          const data2 = {
            id: idP[0].id,
            name,
            price,
            description,
            image: idP[0].image,
            supplies: content,
            amount: 1,
          };

          setOrder((prevOrder) => {
            Cookies.remove("orderDetail");
            const newOrder = [...prevOrder, data2];
            Cookies.set("orderDetail", JSON.stringify(newOrder));
            return newOrder;
          });

          closeModal();
          setNotification({
            msg: " El Producto fue añadido al Carrito!",
            color: "warning",
            buttons: false,
            timeout: 3000,
          });
        } catch (error) {
          console.log("Error al añadir a carito" + error);
        }
      };
      openModal(
        "Añadir al Carrito",
        fieldsAdd,
        [
          { id: 0, name: "No seleccionado", price: 0, stock: 0, status: false },
          ...supplies,
        ],
        "name",
        true,
        handleAdd
      );
    };

    const handleViewDetailsClicks = async (productId) => {
      const res = await getProduct(productId);
      const product = res.data;
      const content = contents.filter((content) => content.product == product.id)
      console.log(content);


      const fieldsview = [
        {
          title: "Producto",
          type: "text",
          name: "name",
          icon: "burger",
          col: "half",
          required: "true",
          value: product.name,
          readonly: true,
        },
        {
          title: "Precio",
          type: "number",
          name: "price",
          icon: "dollar",
          col: "half",
          required: "true",
          value: product.price,
          readonly: true,
        },
        {
          title: "Imagen",
          type: "image",
          name: "image",
          icon: "dollar",
          col: "full",
          image: product.image,
        },
        {
          title: "Descripción",
          type: "text",
          name: "description",
          icon: "comment",
          col: "full",
          required: "true",
          value: product.description,
          readonly: true,
        },
        {
          type: "list",
          columns: ['Nombre'],
          headers: ['name'],
          data: content,
        },
      ];

      openModal("Ver producto", fieldsview, products, "status", false);
    };

    const handleStatusChange = async (productId, status) => {
      try {
        await updateProductStatus(productId, !status);
        setNotification({
          msg: "Estado cambiado exitosamente!",
          color: "info",
          buttons: false,
          timeout: 3000,
        });

      } catch (error) {
        console.error(error);
      }
    };

    const handleDeleteClick = async (productId) => {
      setNotification({
        msg: "¿Seguro deseas eliminar el Producto?",
        color: "warning",
        buttons: true,
        timeout: 0,
        onConfirm: async () => {
          try {
            await deleteProduct(productId);
            setNotification({
              msg: "Producto eliminado exitosamente!",
              color: "info",
              buttons: false,
              timeout: 3000,
            });
            reloadDataTable();

          } catch {
            console.error("Error al eliminar:");
          }
        },
      });
    };

    return (
      <div>
        <Navbar />
        <div className="container is-fluid mt-5">
          <div className="notifications float">
            {notification && (
              <Notification
                msg={notification.msg}
                color={notification.color}
                buttons={notification.buttons}
                timeout={notification.timeout}
                onClose={() => setNotification(null)}
                onConfirm={notification.onConfirm}
              />
            )}
          </div>
          <div className="columns is-centered">
            <div className="column is-fullwidth">
              {/* <Table
              headers =  {[ "Nombre" , "Precio"]}
              key =  {[ "name" , "price"]}
              data = {[]}
            /> */}
              <Button
                text="Crear Producto +"
                color="success"
                col="fullwidth"
                action={() =>
                  openModal(
                    "Nuevo producto",
                    fieldsNew,
                    [
                      {
                        id: 0,
                        name: "No seleccionado",
                        price: 0,
                        stock: 0,
                        status: true,
                      },
                      ...supplies,
                    ],
                    "name",
                    //revisar
                    true,
                    handleCreateProduct
                  )
                }
              />
            </div>
            <div className="column is-9">
              <Input holder="Buscar Producto" icon="magnifying-glass" />
            </div>
            <div className="column is-fullwidth">
              <Button
                text="Generar PDF"
                color="primary"
                col="fullwidth"
                action={generatePDF}
              />

            </div>
          </div>
          <ViewP
            onStatusClick={handleStatusChange}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
            onViewDetails={handleViewDetailsClicks}
            onAdd={handleAddclick}
            data={products}
            Administrador={true}
            generatePDF={generatePDF}
          />
        </div>

        {isOpen && (
          <Modal
            title={modalConfig.title}
            fields={modalConfig.fields}
            dataSelect={modalConfig.dataSelect}
            nameSelect={modalConfig.nameSelect}
            onClose={closeModal}
            buttonSubmit={modalConfig.buttonSubmit}
            submit={modalConfig.submit}
          />
        )}
      </div>
    );
  }