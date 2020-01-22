import React, { useEffect, useState } from 'react';
import { Icon, IconButton, Chip, Tooltip } from '@material-ui/core';
import { FuseAnimate } from '@fuse';
import { withRouter } from 'react-router-dom';
import * as Actions from '../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import FuseUtils from '@fuse/FuseUtils';
import ReactTable from "react-table";
import { makeStyles } from '@material-ui/core/styles';
import _ from '@lodash';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
    chip: {
        marginLeft: theme.spacing(1),
        background: '#ef5350',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '11px'

    },
    chip2: {
        marginLeft: theme.spacing(1),
        background: '#4caf50',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '11px'
    },
    chipOrange: {
        marginLeft: theme.spacing(1),
        background: '#ff9800',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '11px'
    },
}));
function DemandesDevisTable(props) {

    const classes = useStyles();
    const dispatch = useDispatch();
    const demandesDevis = useSelector(({ demandesDevisApp }) => demandesDevisApp.demandesDevis.data);
    const loading = useSelector(({ demandesDevisApp }) => demandesDevisApp.demandesDevis.loading);
    const pageCount = useSelector(({ demandesDevisApp }) => demandesDevisApp.demandesDevis.pageCount);
    const parametres = useSelector(({ demandesDevisApp }) => demandesDevisApp.demandesDevis.parametres);

    const searchText = useSelector(({ demandesDevisApp }) => demandesDevisApp.demandesDevis.searchText);

    const [filteredData, setFilteredData] = useState(null);

    useEffect(() => {
        function getFilteredArray(entities, searchText) {
            const arr = Object.keys(entities).map((id) => entities[id]);
            if (searchText.length === 0) {
                return arr;
            }
            return FuseUtils.filterArrayByString(arr, searchText);
        }

        if (demandesDevis) {
            setFilteredData(getFilteredArray(demandesDevis, searchText));
        }
    }, [demandesDevis, searchText]);



    if (!filteredData) {
        return null;
    }




    return (
        <div className="w-full flex flex-col">


            <FuseAnimate animation="transition.slideUpIn" delay={300}>

                <ReactTable

                    className="-striped -highlight h-full sm:rounded-16 overflow-hidden"
                    getTrProps={(state, rowInfo, column) => {
                        return {
                            className: "h-64 cursor-pointer",
                            onClick: (e, handleOriginal) => {
                                if (rowInfo) {
                                    props.history.push('/demandes_devis/' + rowInfo.original.id);
                                }
                            }
                        }
                    }}
                    getTheadProps={(state, rowInfo, column) => {
                        return {
                            className: "h-64",

                        }
                    }}

                    data={filteredData}
                    columns={[

                        {
                            Header: "Fournisseur",
                            className: "font-bold",
                            id: "fournisseur",
                            accessor: f => f.fournisseur ? f.fournisseur.societe : '',
                        },
                        {
                            Header: "Produit réf.",
                            className: "font-bold",
                            id: "reference",
                            accessor: f => f.produit ? f.produit.reference : '',
                        },
                        {
                            Header: "Quantité",
                            id: "quantity",
                            accessor: f => f.quantity ? f.quantity : '',
                        },
                        {
                            Header: "Nom Contact",
                            id: "contact",
                            accessor: f => f.contact ? f.contact : '',
                        },
                        {
                            Header: "Société",
                            id: "societe",
                            accessor: f => f.societe ? f.societe : '',
                        },
                        {
                            Header: "Téléphone",
                            id: "phone",
                            accessor: f => f.phone ? f.phone : '',
                        },
                        {
                            Header: "Email",
                            id: "email",
                            accessor: f => f.email ? f.email : '',
                        },
                        {
                            Header: "Adresse",
                            id: "adresse",
                            accessor: f => f.adresse ? f.adresse : '',
                        },
                        {
                            Header: "Message",
                            accessor: "message",
                            filterable: false,
                            Cell: row =>
                                _.truncate(row.original.message, {
                                    'length': 36,
                                    'separator': ' '
                                })

                        },
                        {
                            Header: "Date création",
                            accessor: "created",
                            filterable: false,
                            Cell: row => moment(row.original.created).format('DD/MM/YYYY HH:mm')
                        },

                        {
                            Header: "Statut",
                            filterable: false,
                            Cell: row => (
                                <div className="flex items-center">

                                    {

                                        row.original.statut === false
                                            ?
                                            <Chip className={classes.chipOrange} label="En attente" />
                                            :
                                            <Chip className={classes.chip2} label="Valider" />


                                    }

                                </div>
                            )

                        },

                      
                        {
                            Header: "",
                            Cell: row => (
                                <div className="flex items-center">
                                    {
                                        row.original.statut !== 1 ?
                                            <Tooltip title="Supprimer" >
                                                <IconButton className="text-red text-20"
                                                    onClick={(ev) => {
                                                        ev.stopPropagation();
                                                        dispatch(Actions.removeDemande(row.original, parametres));
                                                    }}
                                                >
                                                    <Icon>delete</Icon>
                                                </IconButton>
                                            </Tooltip>
                                            : <Tooltip title="Interdit!" >
                                                <IconButton className="text-20 cursor-not-allowed disable"
                                                    onClick={(ev) => {
                                                        ev.stopPropagation();
                                                    }}
                                                >
                                                    <Icon>delete</Icon>
                                                </IconButton>
                                            </Tooltip>
                                    }
                                    <Tooltip title="Détails" >
                                        <IconButton className="text-teal text-20">
                                            <Icon>remove_red_eye</Icon>
                                        </IconButton>
                                    </Tooltip>

                                </div>
                            )
                        }
                    ]}
                    manual

                    defaultSortDesc={true}
                    pages={pageCount}
                    defaultPageSize={10}
                    loading={loading}
                    showPageSizeOptions={false}
                    onPageChange={(pageIndex) => {
                        parametres.page = pageIndex + 1;
                        dispatch(Actions.setParametresData(parametres))
                    }}

                    onSortedChange={(newSorted, column, shiftKey) => {
                        parametres.page = 1;
                        parametres.filter.id = newSorted[0].id;
                        parametres.filter.direction = newSorted[0].desc ? 'desc' : 'asc';
                        dispatch(Actions.setParametresData(parametres))
                    }}
                    noDataText="No Demande found"
                    loadingText='Chargement...'
                    ofText='sur'
                />
            </FuseAnimate>




        </div>
    );
}

export default withRouter(DemandesDevisTable);
