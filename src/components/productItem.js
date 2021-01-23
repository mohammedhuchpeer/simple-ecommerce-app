import React from "react";

const productItem = (props) => {
  return (
    <div className="column is-left">
      <div className="box">
        <div className="media">
          <div className="media-left">
            <figure className="image is-64x64">
              <img
                src="https://bulma.io/images/placeholders/128x128.png"
                alt={props.product.shortDec}
              />
            </figure>
          </div>
          <div className="media-content">
            <b style={{ textTransform: "capitalize" }}>
              {props.product.name} {"  "}
              <span className="tag is-primary">${props.product.price}</span>
            </b>
            <div>{props.product.shortDesc}</div>
            {props.product.stock > 0 ? (
              <small>{props.product.stock + " Available"}</small>
            ) : (
              <small className="has-text-danger">Out Of Stock</small>
            )}
            <div className="is-clearfix">
              <button
                className="button is-small is-outlined is-primary is-pull-right"
                onClick={() =>
                  props.addToCart({
                    id: props.product.name,
                    product: props.product,
                    amount: 1,
                  })
                }
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default productItem;
