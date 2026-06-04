import React,{useState} from "react";
import {useNavigate} from "react-router-dom";
import {registerUser} from "../services/authService";

const RegisterPage=()=>{

const navigate=useNavigate();

const [form,setForm]=useState({
name:"",
email:"",
password:"",
role:"farmer"
});

const [loading,setLoading]=useState(false);
const [error,setError]=useState("");

const handleSubmit=async(e)=>{

e.preventDefault();

try{

setLoading(true);

await registerUser(form);

navigate("/login");

}catch(err){

setError(
err.response?.data?.detail||
"Registration failed"
);

}
finally{
setLoading(false);
}

};

return(

<div className="container mt-5">

<div className="row justify-content-center">

<div className="col-md-5">

<div className="card shadow border-0">

<div className="card-body p-4">

<h3>Create Account</h3>

{error &&
<div className="alert alert-danger">{error}</div>
}

<form onSubmit={handleSubmit}>

<input
className="form-control mb-3"
placeholder="Full name"
value={form.name}
onChange={(e)=>
setForm({
...form,
name:e.target.value
})
}
/>

<input
className="form-control mb-3"
placeholder="Email"
value={form.email}
onChange={(e)=>
setForm({
...form,
email:e.target.value
})
}
/>

<input
type="password"
className="form-control mb-3"
placeholder="Password"
value={form.password}
onChange={(e)=>
setForm({
...form,
password:e.target.value
})
}
/>

<select
className="form-select mb-4"
value={form.role}
onChange={(e)=>
setForm({
...form,
role:e.target.value
})
}
>

<option value="farmer">
Farmer
</option>

<option value="buyer">
Buyer
</option>

</select>

<button
className="btn btn-success w-100"
>

{loading?
"Creating..."
:
"Register"}

</button>

</form>

</div>

</div>

</div>

</div>

</div>

);

};

export default RegisterPage;