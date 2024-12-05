export const capitalizeFirstLetter = (str) => {
    const newString = str.slice(0,1).toUpperCase().concat(str.slice(1));

    return newString;
};