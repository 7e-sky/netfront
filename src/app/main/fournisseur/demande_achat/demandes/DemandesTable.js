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
function DemandesTable(props) {

    const classes = useStyles();
    const dispatch = useDispatch();
    const demandes = useSelector(({ demandesApp }) => demandesApp.demandes.data);
    const loading = useSelector(({ demandesApp }) => demandesApp.demandes.loading);
    const pageCount = useSelector(({ demandesApp }) => demandesApp.demandes.pageCount);
    const parametres = useSelector(({ demandesApp }) => demandesApp.demandes.parametres);
    const user = useSelector(({auth}) => auth.user);
    const searchText = useSelector(({ demandesApp }) => demandesApp.demandes.searchText);

    const [filteredData, setFilteredData] = useState(null);

    useEffect(() => {
        function getFilteredArray(entities, searchText) {
            const arr = Object.keys(entities).map((id) => entities[id]);
            if (searchText.length === 0) {
                return arr;
            }
            return FuseUtils.filterArrayByString(arr, searchText);
        }

        if (demandes) {
            setFilteredData(getFilteredArray(demandes, searchText));
        }
    }, [demandes, searchText]);



    if (!filteredData) {
        return null;
    }



    return (
        <FuseAnimate animation="transition.slideUpIn" delay={300}>
            <ReactTable
                className="-striped -highlight h-full sm:rounded-16 overflow-hidden"
                getTrProps={(state, rowInfo, column) => {
                    return {
                        className: "h-64 cursor-pointer",
                        onClick: (e, handleOriginal) => {
                            if (rowInfo) {
                                props.history.push('/demandes_prix/' + rowInfo.original.id);
                            }
                        }
                    }
                }}
                getTheadProps={(state, rowInfo, column) => {
                    return {
                        className: "h-64 font-bold",

                    }
                }}

                data={filteredData}
                columns={[

                    {
                        Header: "Référence",
                        className: "font-bold",
                        id: "reference",
                        accessor: f => f.reference ? 'RFQ-' + f.reference : 'En attente',
                    },
                    {
                        Header: "",
                        accessor: "historiques",
                        width:64,
                        filterable: false,
                        Cell: row =>
                         row.original.historiques.length > 0 && _.findKey(row.original.historiques, function(o) { return o.fournisseur.id === user.id; })
                         ?<strong className="text-green">Lu</strong> 
                         : 
                         <strong className="text-orange">Non lu</strong>

                    },
                    {
                        Header: "Description",
                        accessor: "description",
                        filterable: false,
                        Cell: row => (
                            <div className="flex items-center">
                                {_.capitalize(_.truncate(row.original.description, {
                                    'length': 25,
                                    'separator': ' '
                                }))}
                            </div>
                        )
                    },
                    {
                        Header: "Budget",
                        accessor: "budget",
                        Cell: row =>
                            (
                                <>
                                    {
                                        parseFloat(row.original.budget).toLocaleString(
                                            'fr', // leave undefined to use the browser's locale,
                                            // or use a string like 'en-US' to override it.
                                            { minimumFractionDigits: 2 }
                                        )
                                    }
                                    &ensp;
                                    {
                                        row.original.currency ? row.original.currency.name : ''
                                    }
                                </>
                            )
                    },
                    {
                        Header: "Secteurs",
                        accessor: "sousSecteurs.name",
                        filterable: false,
                        Cell: row =>
                            _.truncate(_.join(_.map(row.original.sousSecteurs, 'name'), ', '), {
                                'length': 25,
                                'separator': ' '
                            })

                    },
                    {
                        Header: "Date de création",
                        accessor: "created",
                        filterable: false,
                        Cell: row => moment(row.original.created).format('DD/MM/YYYY HH:mm')
                    },

                    {
                        Header: "Échéance",
                        accessor: "dateExpiration",
                        filterable: false,
                        Cell: row => (
                            <div className="flex items-center">
                                {
                                    moment(row.original.dateExpiration).format('DD/MM/YYYY HH:mm')

                                }

                                {
                                    moment(row.original.dateExpiration) >= moment()
                                        ?

                                        <Chip className={classes.chip2} label={moment(row.original.dateExpiration).diff(moment(), 'days') === 0 ? moment(row.original.dateExpiration).diff(moment(), 'hours') + ' h' : moment(row.original.dateExpiration).diff(moment(), 'days') + ' j'} />
                                        :
                                        <Chip className={classes.chip} label={moment(row.original.dateExpiration).diff(moment(), 'days') === 0 ? moment(row.original.dateExpiration).diff(moment(), 'hours') + ' h' : moment(row.original.dateExpiration).diff(moment(), 'days') + ' j'} />

                                }

                            </div>
                        )

                    },
                    {
                        Header: "Statut",
                        sortable: false,
                        filterable: false,
                        Cell: row => (
                            <div className="flex items-center">

                                {
                                    moment(row.original.dateExpiration) >= moment()
                                        ?
                                        row.original.statut === 0
                                            ?
                                            <Chip className={classes.chipOrange} label="En attente" />
                                            :
                                            (row.original.statut === 1 ? <Chip className={classes.chip2} label="En cours" />
                                                :
                                                <Chip className={classes.chip} label="Refusé" />
                                            )
                                        :
                                        <Chip className={classes.chip} label="Expiré" />

                                }

                            </div>
                        )

                    },
                   

                    {
                        Header: "",
                        Cell: row => (
                            <div className="flex items-center">
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
    );
}

export default withRouter(DemandesTable);
