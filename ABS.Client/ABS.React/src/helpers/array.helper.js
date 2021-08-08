export const swapArray = (arr , indexOne , indexTwo) => {
    let temp = arr[indexOne];
    arr[indexOne] = arr[indexTwo];
    arr[indexTwo] = temp;
    return arr;
}