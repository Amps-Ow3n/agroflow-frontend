import client from "./client";



/*
    CREATE SOURCE

    Used by:
    Supplier SourceForm

    Backend:
    POST /source/register
*/

export const registerSource = async (payload) => {

    const response = await client.post(
        "/source/register",
        payload
    );

    return response.data;

};





/*
    READ SOURCES

    Used by:
    SupplierSourcesPage

    Gets current supplier reality.
*/

export const getMySources = async () => {

    const response = await client.get(
        "/source/my-sources"
    );

    return response.data;

};






/*
    UPDATE SOURCE

    Used by:
    SupplierSourcesPage
    when editing existing supply.

    Backend:
    PUT /source/{id}
*/

export const updateSource = async (
    id,
    payload
) => {


    const response = await client.put(

        `/source/${id}`,

        payload

    );


    return response.data;


};







/*
    DELETE SOURCE

    Important:

    Backend archives.
    It does not destroy data.

    Used by:
    SupplierSourcesPage
*/

export const deleteSource = async(id)=>{


    const response = await client.delete(

        `/source/${id}`

    );


    return response.data;


};