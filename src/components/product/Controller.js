import {BrowserRouter as Router, Route, Routes, NavLink, BrowserRouter} from 'react-router-dom';
import Home from "./Home";
import About from "./About";
import Basic from "./Basic";
import AddProduct from "./AddProduct";
import {ToastContainer} from "react-toastify";
import React, {useEffect} from "react";
import UpdateProduct from "./UpdateProduct";
export default function Controller(){

    return (
        <>
            <ToastContainer/>
            <BrowserRouter>
                <header style={{
                    display:'flex',
                    padding:'10px',
                    margin : '10px'
                }}>
                    <NavLink style={({isActive}) => ({
                        color : isActive ? 'red' : 'blue',
                        textDecoration : 'none',
                        marginRight : '10px'
                    })} to={'/home'}>
                        Home
                    </NavLink>
                    <NavLink
                        style={({isActive}) => ({
                            color : isActive ? 'red' : 'blue',
                            textDecoration : 'none',
                            marginRight : '10px'
                        })}
                        to={'/about'}>
                        About
                    </NavLink>

                    <NavLink
                        style={({isActive}) => ({
                            color : isActive ? 'red' : 'blue',
                            textDecoration : 'none',
                            marginRight : '10px'
                        })}
                        to={'/addProduct'}
                    >
                        Add
                    </NavLink>
                </header>
                <Routes>
                    <Route path={'/home'} element={<Home />}></Route>
                    <Route path={'/addProduct'} element={<AddProduct />}></Route>
                    <Route path={'/about'} element={<Basic/>}></Route>
                    <Route path={'/update/:id'} element={<UpdateProduct/>}></Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}