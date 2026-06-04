export function formatDate(date){

    if(!date) return "-";

    return new Date(
        date
    ).toLocaleDateString(
        "en-UG",
        {
            year:"numeric",
            month:"short",
            day:"numeric"
        }
    );

}


export function daysRemaining(date){

    if(!date) return null;

    const today=
    new Date();

    const target=
    new Date(date);

    const difference=
    target-today;

    return Math.ceil(

        difference/

        (1000*60*60*24)

    );
}