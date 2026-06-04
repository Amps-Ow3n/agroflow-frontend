import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {

const navigate=useNavigate();
const {login}=useAuth();

const [form,setForm]=useState({
email:"",
password:""
});

const [loading,setLoading]=useState(false);
const [error,setError]=useState("");

const handleChange=(e)=>{
setForm({
...form,
[e.target.name]:e.target.value
});
};

const handleSubmit=async(e)=>{
e.preventDefault();

setLoading(true);
setError("");

try{

await login(
form.email,
form.password
);

navigate("/");

}catch(err){

setError(
err.response?.data?.detail ||
"Invalid credentials"
);

}
finally{
setLoading(false);
}

};

return(

<div className="container-fluid min-vh-100">

<div className="row min-vh-100">

<div
className="col-lg-6 d-none d-lg-flex flex-column justify-content-center px-5 text-white"
style={{
background:"linear-gradient(135deg,#14532d,#0f172a)"
}}
>

<h1 className="display-4 fw-bold">
AgroFlow V2
</h1>

<p className="lead text-white-50">

Computational decision system for agricultural supply coordination.

</p>

</div>

<div className="col-lg-6 d-flex align-items-center justify-content-center bg-light">

<div
className="card shadow border-0"
style={{width:"420px"}}
>

<div className="card-body p-4">

<h4 className="fw-bold">

Sign In

</h4>

{error && (

<div className="alert alert-danger">

{error}

</div>

)}

<form onSubmit={handleSubmit}>

<input
name="email"
className="form-control mb-3"
placeholder="Email"
value={form.email}
onChange={handleChange}
required
/>

<input
type="password"
name="password"
className="form-control mb-4"
placeholder="Password"
value={form.password}
onChange={handleChange}
required
/>

<button
className="btn btn-success w-100"
disabled={loading}
>

{loading?
"Signing in..."
:
"Login"}

</button>

</form>

<div className="text-center mt-3">

<button
className="btn btn-link"
onClick={()=>navigate("/register")}
>

Create Account

</button>

</div>

</div>

</div>

</div>

</div>

</div>

);

};

export default LoginPage;