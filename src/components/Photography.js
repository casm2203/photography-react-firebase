import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import "../App.css";
import {
  doc,
  getDocs,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import Modal from "./Modal";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("123456789", 1);

const formPhoto = {
  id: null,
  name_photo: "",
  photographer: "",
  site: "",
  category: "",
  created_at: "",
  details: "",
  origyn_country: "",
  img: "",
};

const Photography = () => {
  const [form, setForm] = useState(formPhoto);
  const [dbs, setDbs] = useState([]);
  const [edit, setEdit] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    //Obtener datos
    const getData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "photo"));
        const array = querySnapshot.docs.map((item) => ({
          ...item.data(),
          id: item.id,
        }));
        setDbs(array);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  //Funcion para crear o editar
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.name_photo ||
      !form.photographer ||
      !form.details ||
      !form.site ||
      !form.origyn_country
    ) {
      alert("Datos incompletos, Por favor validar la información ingresada");
      return;
    }
    if (edit) {
      try {
        const updateArt = doc(db, "photo", form.id);
        await updateDoc(updateArt, form);
        let newData = dbs.map((el) => (el.id === form.id ? form : el));
        setDbs(newData);
        setEdit(false);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    } else {
      try {
        let created = new Date().toISOString().split("T")[0];
        let imdID = nanoid();
        const docRef = await addDoc(collection(db, "photo"), {
          ...form,
          id: nanoid(),
          created_at: created,
          img: imdID,
        });
        setDbs([
          ...dbs,
          { ...form, created_at: created, img: imdID, id: docRef.id },
        ]);
        openM();
      } catch (error) {
        console.log(error);
      }
    }

    handleReset();
  };

  //Eliminar dato
  const deleteData = async (id) => {
    try {
      await deleteDoc(doc(db, "photo", id));
      let newData = dbs.filter((el) => (el.id === id ? null : el));
      setDbs(newData);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  //Preparar datos para editar
  const formUpdate = (data) => {
    console.log(data);
    setForm(data);
    setEdit(true);
  };

  //Obtener valores del formulario
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  //Resetear valores del formulario
  const handleReset = (e) => {
    setForm(formPhoto);
    setEdit(false);
  };

  const closeModal = () =>
    setTimeout(() => {
      setOpenModal(false);
    }, 2000);

  const openM = () => setOpenModal(true);

  return (
    <div className="container-fluid">
      {openModal ? <Modal closeModal={closeModal} /> : ""}
      <div className="row mt-3">
        <div className="col shadow-sm p-3 mb-5 bg-body rounded">
          <div className="container">
            <div className="row">
              {/* Cards */}
              {dbs.map(
                ({
                  id,
                  name_photo,
                  photographer,
                  site,
                  category,
                  created_at,
                  details,
                  origyn_country,
                  img,
                }) => (
                  <div className="card mb-3 w-50" key={id}>
                    <div className="row g-0  p-2">
                      <div className="col-md-4">
                        <img
                          src={`https://picsum.photos/id/102${img}/200/300`}
                          className="card-img-top mr-5"
                          alt="..."
                        />
                      </div>
                      <div className="col-md-8 text-center">
                        <h6 className="card-title text-capitalize">
                          <strong>Nombre de la fotografia:</strong> {name_photo}
                        </h6>
                        <p className="card-text txt-sz text-capitalize">
                          <strong>Fotografo:</strong> {photographer}
                        </p>
                        <p className="card-text txt-sz">
                          <strong>Detalle:</strong> {details}
                        </p>
                        <p className="card-text txt-sz">
                          <strong>Categoria:</strong> {category}
                        </p>
                        <p className="card-text txt-sz">
                          <strong>Sitio de la fotografia:</strong> {site}
                        </p>
                        <p className="card-text txt-sz">
                          <strong>Fecha de la fotografia:</strong> {created_at}
                        </p>
                        <p className="card-text txt-sz">
                          <strong>Pais de origen:</strong> {origyn_country}
                        </p>
                        <div
                          className="btn-group"
                          role="group"
                          aria-label="Basic mixed styles example"
                        >
                          <button
                            onClick={() =>
                              formUpdate({
                                id,
                                name_photo,
                                photographer,
                                site,
                                category,
                                created_at,
                                details,
                                origyn_country,
                                img
                              })
                            }
                            type="button"
                            className="btn btn-warning btn-sz"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => deleteData(id)}
                            type="button"
                            className="btn btn-danger btn-sz"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        <div className="col shadow-sm p-3 mb-5 bg-body rounded">
          {/* Formulario */}
          <h3>{edit ? "Editar Fotografia" : "Agregar Fotografia"}</h3>
          <hr />
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nombre de la fotografia:</label>
              <input
                type="text"
                placeholder="Nombre de la fotografia"
                onChange={handleChange}
                value={form.name_photo}
                name="name_photo"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Nombre del fotografo:</label>
              <input
                type="text"
                placeholder="Nombre del fotografo"
                onChange={handleChange}
                value={form.photographer}
                name="photographer"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Categoria:</label>
              <select
                required
                onChange={handleChange}
                value={form.category}
                name="category"
                className="form-select"
              >
                <option value=""></option>
                <option className="text-capitalize" value="tech">
                  Tech
                </option>
                <option className="text-capitalize" value="animals">
                  animals
                </option>
                <option className="text-capitalize" value="people">
                  people
                </option>
                <option className="text-capitalize" value="arch">
                  arch
                </option>
                <option className="text-capitalize" value="nature">
                  nature
                </option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Detalles:</label>
              <input
                type="text"
                placeholder="Detalles"
                onChange={handleChange}
                value={form.details}
                name="details"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Sitio de la fotografia:</label>
              <input
                type="text"
                placeholder="Sitio de la fotografia"
                onChange={handleChange}
                value={form.site}
                name="site"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Pais de origen:</label>
              <input
                type="text"
                placeholder="Pais de origen"
                onChange={handleChange}
                value={form.origyn_country}
                name="origyn_country"
                className="form-control"
              />
            </div>
            {edit ? (
              <div>
                <button className="btn btn-warning" type="submit">
                  Editar
                </button>
                <button onClick={handleReset} className="btn btn-dark">
                  Cancelar
                </button>
              </div>
            ) : (
              <button className="btn btn-secondary" type="submit">
                Enviar
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Photography;
