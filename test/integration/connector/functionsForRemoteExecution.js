module.exports.fibonacci = (limit) => {
    let x =0;

    for(let i = 0, j = 1,k = 0; k < limit; i=j,j=x,k++)
        x=i+j;

    return x;
};
