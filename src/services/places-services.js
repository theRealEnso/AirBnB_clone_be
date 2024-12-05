import createHttpError from "http-errors";

export const verifyLink = (link) => {
    const splitLink = link.split(".jpg");

    if(splitLink.length > 1 && splitLink[splitLink.length - 1 === ""]){
        return link;
    } else {
        throw createHttpError.BadRequest("The provided url is not a .jpg url. Only .jpg extensions are accepted");
    }
};