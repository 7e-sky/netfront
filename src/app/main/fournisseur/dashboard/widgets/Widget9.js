import React, { useState, useEffect } from 'react';
import { Avatar, Table, TableHead, TableCell, TableRow, Typography, Paper, TableBody, Select } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../store/actions'
import ContentLoader from 'react-content-loader'
import moment from 'moment';
const TableRowContentLoader = props => {
    const random = Math.random() * (1 - 0.7) + 0.7
    return (
        <ContentLoader
            height={40}
            width={1060}
            speed={2}
            primaryColor="#d9d9d9"
            secondaryColor="#ecebeb"
            {...props}
        >
            <rect x="0" y="15" rx="4" ry="4" width="6" height="6.4" />
            <rect x="34" y="13" rx="6" ry="6" width={200 * random} height="12" />
            <rect x="633" y="13" rx="6" ry="6" width={23 * random} height="12" />
            <rect x="653" y="13" rx="6" ry="6" width={78 * random} height="12" />
            <rect x="755" y="13" rx="6" ry="6" width={117 * random} height="12" />
            <rect x="938" y="13" rx="6" ry="6" width={83 * random} height="12" />

            <rect x="0" y="39" rx="6" ry="6" width="1060" height=".3" />
        </ContentLoader>
    )
}

function Widget9(props) {

    const dispatch = useDispatch();

    const widgets = useSelector(({ dashboardApp }) => dashboardApp.widgets);
    const user = useSelector(({ auth }) => auth.user);
    const [currentRange, setCurrentRange] = useState(
        moment().format('Y')
    );

    useEffect(() => {
        dispatch(Actions.getPersonnelPotentiels(currentRange));
    }, [dispatch, currentRange]);

    function handleChangeRange(ev) {
        setCurrentRange(ev.target.value);
    }

    return (
        <>
            {
                widgets.loadingPersonnelPotentiels === false
                    && widgets.personnelPotentiels.length > 0
                    ?
                    <Paper className="w-full rounded-8 shadow-none border-1">
                        <div className="flex items-center justify-between px-16 h-64 border-b-1">
                            <Typography className="text-24">Le suivi du personnel</Typography>

                            <div className="flex">
                                <Typography className="text-11 font-500 rounded-4 text-white bg-blue px-8 py-4">

                                    {widgets.personnelPotentiels.length + " Personnel(s)"}

                                </Typography>
                                <Select
                                    native
                                    className="ml-4  pl-4 text-11"
                                    value={currentRange}
                                    onChange={handleChangeRange}
                                    inputProps={{
                                        name: 'currentRange'
                                    }}
                                    disableUnderline={true}
                                >
                                    {Object.entries({
                                        '0': moment().format('Y'),
                                        '1': moment().subtract(1, 'year').format('Y'),
                                        '2': moment().subtract(2, 'year').format('Y'),
                                    }).map(([key, n]) => {
                                        return (
                                            <option className="text-12 text-black" key={key} value={n}>{n}</option>
                                        )
                                    })}
                                </Select>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <Table className="w-full min-w-full" size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell

                                            className="whitespace-no-wrap"
                                        >
                                            NOM & Prénom
                                    </TableCell>
                                        <TableCell

                                            className="whitespace-no-wrap"
                                        >
                                            Nbr Demandes affectées
                                    </TableCell>
                                        <TableCell

                                            className="whitespace-no-wrap"
                                        >
                                            Nbr Demandes gagnées
                                    </TableCell>
                                        <TableCell

                                            className="whitespace-no-wrap"
                                        >
                                            Nbr Demandes perdues
                                    </TableCell>

                                        <TableCell

                                            className="whitespace-no-wrap"
                                        >
                                            Budgets gagner
                                    </TableCell>

                                        <TableCell

                                            className="whitespace-no-wrap"
                                        >
                                            Budgets perdues
                                    </TableCell>

                                        <TableCell

                                            className="whitespace-no-wrap"
                                        >
                                            Potentiel
                                    </TableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {widgets.personnelPotentiels.map(row => (
                                        <TableRow key={row.personnel.id}>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                className="truncate font-600 font-bold"
                                            >
                                                {row.personnel.name}
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                className="truncate"
                                            >
                                                {row.demandeAffecte.count ? row.demandeAffecte.count : 0}
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                className="truncate"
                                            >
                                                {row.demandeGagner.count ? row.demandeGagner.count : 0}
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                className="truncate"
                                            >
                                                {row.demandePerdue.count ? row.demandePerdue.count : 0}
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                className="truncate text-green"
                                            >
                                                {row.demandeGagner.budget ? row.demandeGagner.budget : 0}
                                                &ensp;{user.data.currency}
                                            </TableCell>

                                            <TableCell
                                                component="th"
                                                scope="row"
                                                className="truncate text-red"
                                            >
                                                {row.demandePerdue.budget ? row.demandePerdue.budget : 0}
                                                &ensp;{user.data.currency}
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                className="truncate font-bold text-blue"
                                            >
                                                {row.demandeAffecte.budget ? row.demandeAffecte.budget : 0}
                                                &ensp;{user.data.currency}
                                            </TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Paper>
                    :
                    Array(6)
                        .fill('')
                        .map((e, i) => (
                            <TableRowContentLoader key={i} style={{ opacity: Number(2 / i).toFixed(1) }} />
                        ))
                    }

        </>
    );
}

export default React.memo(Widget9);
