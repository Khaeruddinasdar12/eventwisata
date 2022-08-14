//import react  
import React, { useState, useEffect } from "react";

//import layout admin
import LayoutAdmin from "../../../layouts/Admin";

//import BASE URL API
import Api from "../../../api";

//import js cookie
import Cookies from "js-cookie";

//import Link from react router dom
import { Link } from "react-router-dom";

//import pagination component
import PaginationComponent from "../../../components/utilities/Pagination";

//import toats
import toast from "react-hot-toast";

//import react-confirm-alert
import { confirmAlert } from 'react-confirm-alert';

//import CSS react-confirm-alert
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

function CategoriesIndex() {

    //title page
    document.title = "Kategori - Administrator Event Wisata";

    //state posts
    const [categories, setCategories] = useState([]);

    //state currentPage
    const [currentPage, setCurrentPage] = useState(1);

    //state perPage
    const [perPage, setPerPage] = useState(0);

    //state total
    const [total, setTotal] = useState(0);

    //state search
    const [search, setSearch] = useState("");

    //token
    const token = Cookies.get("token");

    //function "fetchData"
    const fetchData = async (pageNumber, searchData) => {

        //define variable "page"
        const page = pageNumber ? pageNumber : currentPage;

        //define variable "searchQuery"
        const searchQuery = searchData ? searchData : search;

        //fetching data from Rest API
        await Api.get(`/api/admin/categories?q=${searchQuery}&page=${page}`, {
            headers: {
                //header Bearer + Token
                Authorization: `Bearer ${token}`,
            }
        })
        .then(response => {
            //set data response to state "categories"
            setCategories(response.data.data.data);

            //set currentPage
            setCurrentPage(response.data.data.current_page);

            //set perPage
            setPerPage(response.data.data.per_page);

            //total
            setTotal(response.data.data.total);
        });
    };

    //hook
    useEffect(() => {
        //call function "fetchData"
        fetchData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //function "searchHandler"
    const searchHandlder = (e) => {
        e.preventDefault();

        //call function "fetchDataPost" with params
        fetchData(1, search)
    }

    //function "deleteCategory"
    const deleteCategory = (id) => {

        //show confirm alert
        confirmAlert({
            title: 'Anda Yakin ?',
            message: 'Ingin Hapus Data ?',
            buttons: [{
                    label: 'YES',
                    onClick: async () => {
                        await Api.delete(`/api/admin/categories/${id}`, {
                                headers: {
                                    //header Bearer + Token
                                    Authorization: `Bearer ${token}`,
                                }
                            })
                            .then(() => {

                                //show toast
                                toast.success("Data Deleted Successfully!", {
                                    duration: 4000,
                                    position: "top-right",
                                    style: {
                                        borderRadius: '10px',
                                        background: '#333',
                                        color: '#fff',
                                    },
                                });

                                //call function "fetchData"
                                fetchData();
                            })
                    }
                },
                {
                    label: 'NO',
                    onClick: () => {}
                }
            ]
        });
    }

    return(
        <React.Fragment>
            <LayoutAdmin>
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card border-0 rounded shadow-sm border-top-success">
                            <div className="card-header">
                                <span className="font-weight-bold"><i className="fa fa-folder"></i> KATEGORI</span>
                            </div>
                            <div className="card-body">
                                <form onSubmit={searchHandlder} className="form-group">
                                    <div className="input-group mb-3">
                                        <Link to="/admin/categories/create" className="btn btn-md btn-success"><i className="fa fa-plus-circle"></i> TAMBAH</Link>
                                    </div>
                                </form>
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-hovered">
                                        <thead>
                                        <tr>
                                            <th scope="col">No.</th>
                                            <th scope="col">Gambar</th>
                                            <th scope="col">Nama Kategori</th>
                                            <th scope="col">Aksi</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {categories.map((category, index) => (
                                            <tr key={index}>
                                                <td className="text-center">{++index + (currentPage-1) * perPage}</td>
                                                <td className="text-center">
                                                    <img src={category.image} alt="" width="50" />
                                                </td>
                                                <td>{category.name}</td>
                                                <td className="text-center">
                                                	
<Link to={`/admin/categories/edit/${category.id}`} className="btn btn-sm btn-primary me-2"><i className="fa fa-pencil-alt"></i></Link>
    <button onClick={() => deleteCategory(category.id)} className="btn btn-sm btn-danger"><i className="fa fa-trash"></i></button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </LayoutAdmin>
        </React.Fragment>
    )

}

export default CategoriesIndex