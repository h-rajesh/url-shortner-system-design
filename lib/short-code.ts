const CHARACTERS = 
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
export function generateShortCode(length=7) : string {
    let res = "";

    for(let i=0;i<length;i++){
        const randomIndex = Math.floor(
            Math.random()* CHARACTERS.length
        );

        res+=CHARACTERS[randomIndex];
    }
    return res;
}