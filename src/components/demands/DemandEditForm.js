import { useState } from "react";
import { updateDemand } from "../../api/demandApi";
import Loader from "../common/Loader";
import ErrorState from "../common/ErrorState";

export default function DemandEditForm({
  demand,
  onSuccess,
  onCancel
}) {

  const [form, setForm] = useState({
    product: demand.product,
    quantity: demand.quantity,
    delivery_start: demand.delivery_start,
    delivery_end: demand.delivery_end
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value
    });
  }

  async function handleSubmit(e) {

    e.preventDefault();

    try {

      setLoading(true);
      setError("");

      await updateDemand(
        demand.id,
        {
          ...form,
          quantity: Number(form.quantity)
        }
      );

      if (onSuccess) {
        onSuccess();
      }

    } catch (err) {

      setError(
        err?.response?.data?.detail ||
        "Failed to update demand."
      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="card shadow-sm mt-4">

      <div className="card-body">

        <h5 className="fw-bold mb-3">

          Edit Demand

        </h5>

        {error && (

          <ErrorState
            message={error}
          />

        )}

        <form
          onSubmit={handleSubmit}
        >

          <div className="mb-3">

            <label className="form-label">

              Product

            </label>

            <input
              className="form-control"
              name="product"
              value={form.product}
              onChange={handleChange}
            />

          </div>

          <div className="mb-3">

            <label className="form-label">

              Quantity

            </label>

            <input
              type="number"
              className="form-control"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
            />

          </div>

          <div className="row">

            <div className="col-md-6">

              <label className="form-label">

                Delivery Start

              </label>

              <input
                type="date"
                className="form-control"
                name="delivery_start"
                value={form.delivery_start}
                onChange={handleChange}
              />

            </div>

            <div className="col-md-6">

              <label className="form-label">

                Delivery End

              </label>

              <input
                type="date"
                className="form-control"
                name="delivery_end"
                value={form.delivery_end}
                onChange={handleChange}
              />

            </div>

          </div>

          <div className="mt-4 d-flex gap-2">

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >

              Save Changes

            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >

              Cancel

            </button>

          </div>

          {loading && (

            <Loader
              text="Updating demand..."
            />

          )}

        </form>

      </div>

    </div>

  );

}