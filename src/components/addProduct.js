import axios from "axios";
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import withContext from "../hoc/withContext";

const AddProduct = (props) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [description, setDescription] = useState("");
  const { user } = props.context;

  const save = async (event) => {
    event.preventDefault();
    if (name && price) {
      const id =
        Math.random().toString(36).substring(2) + Date.now().toString(36);

      await axios.post("http://localhost:3001/products", {
        id,
        name,
        price,
        stock,
        shortDesc,
        description,
      });
      props.context.addProduct(
        {
          name,
          price,
          shortDesc,
          description,
          stock: stock || 0,
        },
        () => {
          setName("");
          setPrice("");
          setStock("");
          setShortDesc("");
          setDescription("");
        }
      );
    }
  };

  return !(user && user.accessLevel < 1) ? (
    <Redirect to="/" />
  ) : (
    <>
      <div className="hero is-primary">
        <div className="hero-body container">
          <h4 className="title">Add Product</h4>
        </div>
      </div>
      <br />
      <br />
      <form onSubmit={save}>
        <div className="columns is-mobile is-centered">
          <div className="column is-one-third">
            <div className="field">
              <label className="label">Product Name:</label>
              <input
                className="input"
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label className="label">Price:</label>
              <input
                className="input"
                type="number"
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label className="label">Available in Stock</label>
              <input
                className="input"
                type="number"
                name="stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label className="label">Description</label>
              <input
                className="textarea"
                type="text"
                rows="2"
                style={{ resize: "none" }}
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="field">
              <label className="label">Short Description:</label>
              <input
                className="input"
                type="text"
                name="shortDesc"
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
              />
            </div>
            <div className="field is-clearfix">
              <button
                className="button is-primary is-outlined is-pulled-right"
                type="submit"
                onClick={save}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default withContext(AddProduct);
