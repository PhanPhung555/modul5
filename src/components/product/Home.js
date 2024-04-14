import {useEffect, useRef, useState, useTransition} from "react";
import * as ProductSever from "../../services/ProductServices"
import {toast} from "react-toastify";
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from "react";
import {alpha, styled} from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddProduct from "./AddProduct";
import {Link} from "react-router-dom";


const label = {inputProps: {'aria-label': 'Checkbox demo'}};

export default function Home() {
    const [listProduct, setListProduct] = useState([])
    const [listIdInput, setListIdInput] = useState([]);
    const [checkedAll, setCheckedAll] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenuDE = Boolean(anchorEl);
    const [idProductDE, setIdProductDE] = useState('');
    const [openUpdate, setOpenUpdate] = useState(false);
    const productUpdate = useRef({});


    const formatIsoDate = (isoDate) => {
        const date = new Date(isoDate);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // hàm call API lấy dữ liệu
    const getAllProduct = async () => {
        const temp = await ProductSever.GetAllProduct();

        const modifiedData = temp.map(product => ({
            ...product,
            manufacturingDate: formatIsoDate(product.manufacturingDate),
            expirationDate: formatIsoDate(product.expirationDate)
        }));
        setListProduct(modifiedData);
    }
    useEffect(() => {
        getAllProduct();
        return () => {
            console.log("clear");
        };
    }, []);

    const handleSelectAll = (e) => {
        if (!e.target.checked) {
            setListIdInput([])
        } else {
            setCheckedAll(!checkedAll);
            !checkedAll
                ? setListIdInput(listProduct.map(product => product.id))
                : setListIdInput([])
        }
    };

    const handleOnChangeIs = (event, id) => {
        const isChecked = event.target.checked;
        if (isChecked) {
            setListIdInput([...listIdInput, id]);
        } else {
            setListIdInput(listIdInput.filter(item => item !== id));
        }
    }

    //  Xoa Product
    const openDelete = () => {
        setOpenModalDelete(true)
    }
    const handleAgreeDelete = (listId) => {
        handleDeleteProduct(listId);
    }
    const handleDeleteProduct = async (listId) => {
        const temp = await ProductSever.deleteAllProduct(listId);
        setAnchorEl(false)
        if (temp) {
            getAllProduct();
            toast.success("Xóa Dữ Liệu Thành Công");
            setOpenModalDelete(false)
            setListIdInput([]);
        } else {
            toast.error("Xóa Dữ liệu không thành công! ")
        }
    }
    const handleDeleteProductId = () => {
        setOpenModalDelete(true)
    }
    const handleClick = (e, id) => {
        setListIdInput([id])
        setIdProductDE(id)
        setAnchorEl(e.currentTarget);
    };

    const handleUpdateProduct = async (id) => {
        // Đối tượng cần cập nhật - id
        const product = await ProductSever.getOneProduct(id);
        productUpdate.current = product;
        if (Object.keys(product).length !== 0) {
            setOpenUpdate(true)
        } else {
        }
    }

    const values = {
        setListIdInput,
        openMenuDE,
        anchorEl,
        setAnchorEl,
        idProductDE,
        setOpenModalDelete,
        handleDeleteProductId,
        handleUpdateProduct
    }

    return (
        <>
            <div>
                <h1 style={{margin: '0 50px'}}>Danh sách sản phẩm </h1>
                <div className="container-full " style={{margin: '0 50px'}}>
                    <table className="table caption-top">
                        <caption>Bảng</caption>
                        <thead>
                        <tr>
                            <th scope="col">
                                <Checkbox checked={listIdInput.length > 0}
                                          indeterminate={listIdInput.length > 0}
                                          onChange={handleSelectAll} {...label}
                                          size="small"/>
                            </th>
                            <th scope="col">ID</th>
                            <th scope="col">Tên sản phẩm</th>
                            <th scope="col">Giá</th>
                            <th scope="col">Địa điểm</th>
                            <th scope="col">Ngày sản xuất</th>
                            <th scope="col">Ngày hết hạn</th>
                        </tr>
                        </thead>
                        <tbody>
                        {listProduct.map(product => (
                            <tr key={product.id}>
                                <td>
                                    <Checkbox checked={listIdInput.includes(product.id)}
                                              onChange={(e) => handleOnChangeIs(e, product.id)} {...label}
                                              size="small"/>
                                </td>
                                <td className="border px-4 py-2">
                                    <Button className={'a-delete-edit'}
                                            id="demo-customized-button"
                                            aria-controls={openMenuDE ? 'demo-customized-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={openMenuDE ? 'true' : undefined}
                                            onClick={(e) => handleClick(e, product.id)}
                                    >
                                        {product.id}
                                    </Button>
                                    <div>
                                        <MenuDE value={values}/>
                                    </div>
                                </td>
                                <td className="border px-4 py-2">{product.nameProduct}</td>
                                <td className="border px-4 py-2">{product.priceProduct}</td>
                                <td className="border px-4 py-2">{product.productionSiteProduct}</td>
                                <td className="border px-4 py-2">{product.manufacturingDate}</td>
                                <td className="border px-4 py-2">{product.expirationDate}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div style={{display: 'flex'}}>
                        <Button variant="outlined"
                                onClick={openDelete}
                                disabled={!listIdInput.length > 0}>
                            Delete
                        </Button>
                        <p style={{margin: '5px 0 0 10px'}}>{listIdInput.length > 0
                            ? <span>ID : {listIdInput.length}</span>
                            : <span></span>}
                        </p>
                    </div>
                </div>
                <OpenDelete open={openModalDelete}
                            handleClose={() => setOpenModalDelete(false)}
                            handleAgree={() => handleAgreeDelete(listIdInput)}
                />

            </div>
        </>
    )
}

// Modal Material - UI React js Delete
function OpenDelete({open, handleClose, handleAgree}) {

    return (
        <>
            <React.Fragment>

                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Dữ liệu sẽ được xóa?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Bạn có chắc chắn với quyết định xóa dữ liệu này . Mời chọn
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleAgree}>Đồng ý</Button>
                        <Button onClick={handleClose} autoFocus>
                            Không Đồng Ý
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        </>

    )
}

const MenuDE = ({value}) => {

    return (
        <>
            <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={value.anchorEl}
                open={value.openMenuDE}
                onClose={() => (value.setAnchorEl(null) || value.setListIdInput([]))}
            >
                <Link className={'link-edit'} to={`/update/${value.idProductDE}`}>
                    <MenuItem onClick={() => value.handleUpdateProduct(value.idProductDE)}
                              disableRipple>
                        <EditIcon/>
                        Edit
                    </MenuItem>
                </Link>
                <MenuItem onClick={() => value.handleDeleteProductId(value.idProductDE)}>
                    <DeleteIcon/>
                    Delete
                </MenuItem>
            </StyledMenu>
        </>
    )
}
const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
        }}
        {...props}
    />
))(({theme}) => ({
    '& .MuiPaper-root': {
        borderRadius: 4,
        marginTop: theme.spacing(-1),
        border: '1px solid #ddd',
        minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(44,43,43)' : theme.palette.grey[300],
        boxShadow:
            'none',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));