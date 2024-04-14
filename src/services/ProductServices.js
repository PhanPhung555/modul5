import axios from "axios";

// Việc Call API là bất đồng bộ nên sử dụng async với await sử lý bất đồng bộ thành đồng bộ
// Await luôn đi với async
const url = "";
export const GetAllProduct = async () => {
    try {
        const temp = await axios.get("http://localhost:3000/product");
        console.log(temp)
        return temp.data;
    } catch (error) {
        console.log(error)
    }
}

export const deleteAllProduct = async (value) => {
    try {
        await Promise.all(value.map(id => axios.delete(`http://localhost:3000/product/${id}`)))
        return true;
    } catch (error) {
        return false;
    }
}
export const updateProductId = async (product) => {
    try {
        await axios.put(`http://localhost:3000/product/${product.id}`,product)
        return  true;
    }catch (error){
        return error;
    }
}
export const getOneProduct = async (idProduct) => {
    try {
        return (await axios.get(`http://localhost:3000/product/${idProduct}`)).data;
    } catch (error) {
        console.log(error)
        return false
    }
}
export const addProduct = async (product) => {
    try {
        return await axios.post("http://localhost:3000/product", product);
    } catch (error) {
        return error;
    }
}