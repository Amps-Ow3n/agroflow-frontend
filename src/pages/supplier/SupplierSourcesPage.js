import { useEffect, useState } from "react";

import SourceForm from "../../components/supply/SourceForm";
import SourceList from "../../components/supply/SourceList";

import {
  getMySources,
  updateSource,
  deleteSource
} from "../../api/sourceApi";

import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import {getErrorMessage}
from "../../utils/errorHandler";

export default function SupplierSourcesPage() {


  const [sources, setSources] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [editingSource, setEditingSource] = useState(null);

  const [actionError, setActionError] = useState("");

  const [saving, setSaving] = useState(false);


  /*
    Central reload function.

    Type C idea:
    One source of truth.

    After:
    - create
    - update
    - delete

    we refresh from backend.

    We don't manually guess the new state.
  */

  async function loadSources() {

    try {

      setLoading(true);

      setError("");

      const data = await getMySources();

      setSources(data);


    } catch (err) {

  const message =
    err.response?.data?.detail ||
    err.response?.data?.message ||
    "Unable to load supply sources. Please try again.";

  setError(message);

} finally {

      setLoading(false);

    }

  }

  useEffect(()=>{

    loadSources();

  },[]);

  /*
    Save edited source

    Flow:

    SourceForm
        |
        onSave()
        |
    updateSource API
        |
    backend
        |
    reload truth
  */

  async function handleUpdate(id,payload){

    try {

      setSaving(true);

      setActionError("");

      await updateSource(id,payload);

      setEditingSource(null);

      await loadSources();


    } catch (err) {

  const message =
    err.response?.data?.detail ||
    err.response?.data?.message ||
    "Unable to update supply source.";

  setActionError(message);

}
finally {

  setSaving(false);

}
  }

  /*
    Delete is actually archive
    because backend does not destroy records.

    Important Type C principle:

    Preserve history.
  */

  async function handleDelete(id){

    const confirmed = window.confirm(
  "Delete this source?\n\nUnused sources are permanently deleted.\nPreviously used sources are archived automatically."
);


    if(!confirmed)
      return;


    try {
      setSaving(true);

      setActionError("");

      await deleteSource(id);

      await loadSources();


    } catch (err) {

  const message =
      err.response?.data?.detail ||
      err.response?.data?.message ||
      "Unable to remove supply source.";

  setActionError(message);

}
finally {

  setSaving(false);

}
  }

  if(loading)

    return (
      <Loader text="Loading supply sources..." />
    );

  if(error)

    return (
      <ErrorState message={error}/>
    );

  return (

    <div className="container-fluid">


      {/* HEADER */}

      <div className="mb-4">

        <h2 className="fw-bold">
          Supply Intelligence
        </h2>

        <p className="text-muted">
          View and manage upstream supply capacity.
        </p>

      </div>



      {
        actionError &&

        <div className="alert alert-danger">

          {actionError}

        </div>

      }





      <div className="row g-4">


        {/* REALITY VIEW */}

        <div className="col-lg-7">


          <div className="card shadow-sm border-0 p-3">


            <h5 className="mb-3">

              Supply Reality

            </h5>


            <p className="text-muted small">

              Current registered supply sources.

            </p>



            <SourceList

              sources={sources}

              onEdit={setEditingSource}

              onDelete={handleDelete}

            />


          </div>


        </div>





        {/* ACTION VIEW */}

        <div className="col-lg-5">


          <div className="card shadow-sm border-0 p-3">


            <h5 className="mb-3">

              {
                editingSource
                ?
                "Edit Supply Source"
                :
                "Declare New Access"
              }

            </h5>



            <SourceForm

              saving={saving}
              
              editingSource={editingSource}

              onSuccess={loadSources}

              onUpdate={handleUpdate}

              onCancelEdit={() =>
                setEditingSource(null)
              }

            />



          </div>


        </div>



      </div>


    </div>

  );

}