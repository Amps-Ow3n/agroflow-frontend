export function formatPercentage(
    value,
    total
){

    if(
        !value ||
        !total
    ){
        return "0%";
    }

    return (
        (
            value/
            total
        )*100
    ).toFixed(1)+"%";
}



export function formatQuantity(
    value
){

    return Number(
        value || 0
    ).toLocaleString();
}



export function capitalize(
    text
){

    if(!text)
    return "";

    return text
    .charAt(0)
    .toUpperCase()

    +

    text.slice(1)
    .toLowerCase();

}