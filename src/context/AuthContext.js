import {
createContext,
useEffect,
useState
}
from "react";

import apiClient from "../services/apiClient";

export const AuthContext=
createContext();

function parseJWT(token){

try{

return JSON.parse(
atob(
token.split(".")[1]
)
);

}catch{

return null;

}

}

export function AuthProvider({
children
}){

const [auth,setAuth]=
useState({

token:null,
role:null,
userId:null,
loading:true

});

useEffect(()=>{

restoreSession();

},[]);

const restoreSession=()=>{

const token=
localStorage.getItem(
"access_token"
);

if(!token){

setAuth(prev=>({

...prev,
loading:false

}));

return;

}

const payload=
parseJWT(token);

if(!payload){

localStorage.removeItem(
"access_token"
);

setAuth(prev=>({

...prev,
loading:false

}));

return;

}

setAuth({

token,
role:payload.role,
userId:payload.id,
loading:false

});

};

const login=async(
email,
password
)=>{

const response=
await apiClient.post(
"/login",
null,
{
params:{
email,
password
}
}
);

const token=
response.data.access_token;

localStorage.setItem(
"access_token",
token
);

const payload=
parseJWT(token);

setAuth({

token,
role:payload.role,
userId:payload.id,
loading:false

});

return payload;

};

const logout=()=>{

localStorage.removeItem(
"access_token"
);

setAuth({

token:null,
role:null,
userId:null,
loading:false

});

};

const value={

token:auth.token,
role:auth.role,
userId:auth.userId,

login,
logout,

isAuthenticated:
!!auth.token

};

if(auth.loading){

return null;

}

return(

<AuthContext.Provider
value={value}
>

{children}

</AuthContext.Provider>

);

}