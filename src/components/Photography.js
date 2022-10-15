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
import { nanoid } from "nanoid";
import Modal from "./Modal";

const formPhoto = {
  id: null,
  name_photo: "",
  photographer: "",
  site: "",
  category: "",
  created_at: "",
  details: "",
  origyn_country: "",
};

const Artwork = () => {
  const [form, setForm] = useState(formPhoto);
  const [dbs, setDbs] = useState([]);
  const [edit, setEdit] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    //Obtener datos
    const getData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "artwork"));
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
      !form.name_art ||
      !form.artist ||
      !form.details ||
      !form.museum ||
      !form.origyn_country
    ) {
      alert("Datos incompletos, Por favor validar la información ingresada");
      return;
    }
    if (edit) {
      try {
        const updateArt = doc(db, "artwork", form.id);
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
        const docRef = await addDoc(collection(db, "artwork"), {
          ...form,
          id: nanoid(),
          created_at: created,
        });
        setDbs([...dbs, { ...form, created_at: created, id: docRef.id }]);
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
      await deleteDoc(doc(db, "artwork", id));
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
    console.log(e);
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
                  name_art,
                  artist,
                  museum,
                  category,
                  created_at,
                  details,
                  origyn_country,
                }) => (
                  <div className="col-4 mb-1" key={id}>
                    <div className="card w-100">
                      <div className="card-body">
                        <img
                          src={`https://placeimg.com/200/200/${category}`}
                          className="card-img-top"
                          alt="..."
                        />
                        <h6 className="card-title text-capitalize">
                          {" "}
                          {name_art}
                        </h6>
                        <p className="card-text txt-sz text-capitalize">
                          <strong>Artista:</strong> {artist}
                        </p>
                        <p className="card-text txt-sz">
                          <strong>Detalle:</strong> {details}
                        </p>
                        <p className="card-text txt-sz">
                          <strong>Categoria:</strong> {category}
                        </p>
                        <p className="card-text txt-sz">
                          <strong>Museo:</strong> {museum}
                        </p>
                        <p className="card-text txt-sz">
                          <strong>Fecha del arte:</strong> {created_at}
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
                                name_art,
                                artist,
                                museum,
                                category,
                                created_at,
                                details,
                                origyn_country,
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
          <h3>{edit ? "Editar Obra de arte" : "Agregar Obra de arte"}</h3>
          <hr />
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nombre de la obra de arte:</label>
              <input
                type="text"
                placeholder="Nombre de la obra de arte"
                onChange={handleChange}
                value={form.name_art}
                name="name_art"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Nombre del artista:</label>
              <input
                type="text"
                placeholder="Nombre del artista"
                onChange={handleChange}
                value={form.artist}
                name="artist"
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
              <label className="form-label">Museo:</label>
              <input
                type="text"
                placeholder="Museo"
                onChange={handleChange}
                value={form.museum}
                name="museum"
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
                </button>{" "}
                <button onClick={handleReset} className="btn btn-dark">
                  Cancelar
                </button>
              </div>
            ) : (
              <button className="btn btn-success" type="submit">
                Enviar
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Artwork;
