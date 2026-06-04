import {useState} from "react";

export default function useApi(apiFunction){

    const [loading,setLoading]=useState(false);

    const [error,setError]=useState(null);

    const [data,setData]=useState(null);

    const execute = async (...params)=>{

        try{

            setLoading(true);

            setError(null);

            const result=
            await apiFunction(...params);

            setData(result);

            return result;

        }

        catch(err){

            setError(

                err.response?.data?.detail ||

                "Unexpected error"
            );

            throw err;
        }

        finally{

            setLoading(false);

        }

    };

    return{

        loading,
        error,
        data,
        execute
    };

}