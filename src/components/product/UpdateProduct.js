import {Navigate, useParams} from "react-router-dom";
import {ErrorMessage, Field, Form, Formik} from "formik";
import React, {useEffect, useRef, useState} from "react";
import * as Yup from "yup";
import * as ProductServices from "../../services/ProductServices";
import {toast} from "react-toastify";
import {Backdrop} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import {useNavigate} from "react-router-dom";

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export default function UpdateProduct() {

    const {id} = useParams();
    const navigator = useNavigate();
    const [product, setProduct] = useState();
    const [openLoading, setOpenLoading] = useState(false);

    useEffect(() => {
        getOneProduct()
    }, [id])
    const getOneProduct = async () => {
        const product = await ProductServices.getOneProduct(id);
        setProduct(product)

    }
    console.log(product)
    const values = {
        openLoading
    }

    const validateObjectProduct = Yup.object().shape({
        nameProduct: Yup.string().min(5, "- Tên Không được nhỏ hơn 5 kí tự")
            .max(100, "Tên không được lớn hơn 100 kí tự")
            .matches(/^[a-zA-Z0-9\s]*$/, "- Không được chứa kí tự đặc biệt"),
        priceProduct: Yup.number().min(1001, "- Gía sản phẩm lớn hơn 1000"),
        manufacturingDate: Yup.string()
            .nullable("Null")
            .required("- Ko được để trống"),
        expirationDate: Yup.date()
            .test('is-after-manufacturing', '- Ngày hết hạn phải sau ngày sản xuất', function (value) {
                const manufacturingDate = new Date(this.parent.manufacturingDate);
                const expirationDate = new Date(value);
                return expirationDate > manufacturingDate;
            })
            .required("- Ko được để trống")
    })

    // Đoạn code lưu Product với sever
    const handleUpdateProduct = async (values) => {
        const temp = await ProductServices.updateProductId(values);
        setOpenLoading(true)
        if (temp) {
            await wait(1000)
            setTimeout(() => {
                showSuccess(201)
            }, 550)
            navigator('/home')
        } else showSuccess(400)
        setOpenLoading(false)
    }

    // Đoạn mã hiển thị thông báo thành công hay thất bại
    const showSuccess = (value) => {
        if (value === 205) {
            toast.loading("Loading", {autoClose: false});
        } else if (value === 201) {
            toast.success("Update thành công")
        } else {
            toast.error("Update thất bại ! ")
        }
    }
    if (!product) return <div>Loading...</div>


    return (
        <>
            <main className={'body-container'}>
                <Formik initialValues={product}
                        validationSchema={validateObjectProduct}
                        onSubmit={handleUpdateProduct}
                        validateOnBlur={true}
                        validateOnMount={true}
                    // onReset={handleReset}
                >
                    {({
                          values,
                          errors,
                          handleSubmit,
                          isSubmitting,
                          isValid,
                          dirty,
                          resetForm

                      }) => (
                        <section className="container">
                            <h2>Registration Form</h2>
                            <Form onSubmit={handleSubmit}>
                                <div className="input-box">
                                    <div style={{display: 'flex'}}>
                                        <label> Name Product </label>
                                        <ErrorMessage className={"error-input"} name="nameProduct"
                                                      component="p"></ErrorMessage>
                                    </div>
                                    <Field type="text"
                                           style={BroderErr(errors.nameProduct)}
                                           placeholder="Name Product" name="nameProduct" required/>
                                </div>
                                <div className={"column"}>
                                    <div className="input-box">
                                        <div style={{display: 'flex'}}>
                                            <label> Price Product </label>
                                            <ErrorMessage className={"error-input"} name="priceProduct"
                                                          component="p"></ErrorMessage>
                                        </div>
                                        <Field
                                            className={'input-price'}
                                            name='priceProduct'
                                            type="number"
                                            style={BroderErr(errors.priceProduct)}
                                            min={1000}
                                            placeholder=" Price Product" required/>
                                    </div>
                                    <div className="input-box">
                                        <label>ProductionSiteProduct</label>
                                        <Field name='productionSiteProduct' type="text"
                                               placeholder="productionSiteProduct" required/>
                                    </div>
                                </div>

                                <div className="column">
                                    <div className="input-box">
                                        <div style={{display: 'flex'}}>
                                            <label>ManufacturingDate</label>
                                            <ErrorMessage className={"error-input"} name="manufacturingDate"
                                                          component="p"></ErrorMessage>
                                        </div>
                                        <Field name='manufacturingDate' type="date"
                                               style={BroderErr(errors.manufacturingDate)}
                                               placeholder="Enter manufacturingDate"
                                               required/>
                                    </div>
                                </div>
                                <div className={"column"}>
                                    <div className={"input-box"}>
                                        <div style={{display: 'flex'}}>
                                            <label>expirationDate</label>
                                            <ErrorMessage className={"error-input"} name="expirationDate"
                                                          component="p"></ErrorMessage>
                                        </div>

                                        <Field name='expirationDate' type="date"
                                            // disabled={values.manufacturingDate}
                                               style={!errors.manufacturingDate ? BroderErr(errors.expirationDate) : null}
                                               placeholder="Enter expirationDate"
                                               required/>
                                    </div>
                                </div>
                                <div className="input-box" style={{
                                    display: 'flex'
                                }}>
                                    <button className={'btn-submit'} disabled={isSubmitting || !dirty || !isValid}
                                            type="submit"
                                            style={{margin: '0 10px'}}>Submit
                                    </button>
                                    <button type="reset" onClick={resetForm}
                                            className={'btn-reset'}
                                    >Reset
                                    </button>
                                </div>
                            </Form>
                        </section>
                    )}
                </Formik>
            </main>
            <Loading values={values}/>
        </>
    )
}
const Loading = ({values}) => {

    return (
        <>
            <Backdrop
                sx={{color: '#2196f3', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={values.openLoading}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
        </>
    )
}
const BroderErr = (err) => {
    return !err ? {border: '1px solid #ddd'} : {border: '1px solid red'}
}