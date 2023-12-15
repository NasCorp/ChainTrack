import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import React, { useContext, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Alert,
  IconButton,
  Snackbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  AddMonitorActionCard,
  ConnectActionCard,
  StatsActionCard,
  DebugActionCard,
  TransactionModal,
  TableTabs,
  CatalogActionCard,
} from '../components';
import {
  shouldDisplayReconnectButton,
  addMonitor,
  updateMonitor,
} from '../utils';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import { Monitor, PredefinedMonitor } from '../../../shared/types';
// eslint-disable-next-line import/no-unassigned-import
import './styles.css';
import useThrowAsyncError from '../utils/errorHandler';
import Layout from '../components/Layout';

const transactionAddedText = 'New transaction has been added!';
const transactionUpdatedText = 'Transaction has been updated!';
const maxColumnsInGridContainer = 12;

const TrackingPage = () => {
  const [state, dispatch] = useContext(MetaMaskContext);
  const theme = useTheme();
  const screenLessThanMedium = useMediaQuery(theme.breakpoints.down('md'));
  const screenLessThanLarge = useMediaQuery(theme.breakpoints.down('lg'));
  const [successSnackbarText, setSuccessSnackbarText] = useState<string>('');
  const [editTransaction, setEditTransaction] = useState<boolean>(false);
  const [openTransactionModal, setOpenTransactionModal] = useState(false);
  const [predefinedMonitor, setPredefinedMonitor] =
    useState<PredefinedMonitor>();
  const [tab, setTab] = useState(0);
  const throwAsyncError = useThrowAsyncError();
  const amountOfCards = shouldDisplayReconnectButton(state.installedSnap)
    ? 4
    : 3;

  const getCardDimension = () => {
    if (screenLessThanMedium) {
      return false;
    } else if (screenLessThanLarge) {
      return 6;
    }

    return maxColumnsInGridContainer / amountOfCards;
  };

  return (
    <Layout>
      {({
        handleConnectClick,
        handleReloadClick,
        handleAddClick,
        handleResetClick,
        isMetaMaskReady,
        loadSnapData,
      }) => (
        <Box display="flex" flexDirection="column" alignItems="center" flex="1">
          <Box sx={{ flexGrow: 1 }} margin="24px" width="100%">
            <Grid container justifyContent="space-evenly" alignItems="stretch">
              <Grid item xs={11}>
                <Grid
                  container
                  spacing={{ xs: 2, md: 2 }}
                  flexDirection={screenLessThanMedium ? 'column' : undefined}
                >
                  <Grid item xs={getCardDimension()}>
                    {state.installedSnap ? (
                      <StatsActionCard
                        alerts={state?.alerts || []}
                        monitors={state?.monitors || []}
                        userStats={state?.userStats || {}}
                      />
                    ) : (
                      <ConnectActionCard
                        installedSnap={state.installedSnap}
                        handleConnectClick={handleConnectClick}
                        isMetaMaskReady={isMetaMaskReady}
                      />
                    )}
                  </Grid>
                  <Grid item xs={getCardDimension()}>
                    <AddMonitorActionCard
                      installedSnap={state.installedSnap}
                      handleSendAddClick={() => setOpenTransactionModal(true)}
                    />
                  </Grid>
                  <Grid item xs={getCardDimension()}>
                    <CatalogActionCard
                      installedSnap={state.installedSnap}
                      handleGoToCatalogClick={() => {
                        setTab(2);
                      }}
                    />
                  </Grid>
                  {shouldDisplayReconnectButton(state.installedSnap) && (
                    <Grid item xs={getCardDimension()}>
                      <DebugActionCard
                        handleResetClick={handleResetClick}
                        handleReloadClick={handleReloadClick}
                        handleConnectClick={handleConnectClick}
                        handleAddClick={handleAddClick}
                      />
                    </Grid>
                  )}
                </Grid>
              </Grid>
              <Grid item xs={11} marginTop="24px">
                <TableTabs
                  monitors={state?.monitors || []}
                  loadSnapData={loadSnapData}
                  alerts={state?.alerts || []}
                  tab={tab}
                  setTab={setTab}
                  setOpenTransactionModal={(
                    newPredefinedMonitor: PredefinedMonitor,
                    isEditTransaction?: boolean,
                  ) => {
                    setPredefinedMonitor(newPredefinedMonitor);
                    setOpenTransactionModal(true);
                    setEditTransaction(Boolean(isEditTransaction));
                  }}
                />
              </Grid>
            </Grid>
          </Box>
          <Fab
            color="secondary"
            aria-label="add"
            sx={{
              margin: 0,
              top: 'auto',
              right: 20,
              bottom: 20,
              position: 'fixed',
            }}
            onClick={() => setOpenTransactionModal(true)}
            disabled={!state.installedSnap}
          >
            <AddIcon />
          </Fab>
          {openTransactionModal && (
            <TransactionModal
              editTransaction={editTransaction}
              setOpenTransactionModal={setOpenTransactionModal}
              handleClose={() => {
                setPredefinedMonitor(undefined);
                setOpenTransactionModal(false);
                setEditTransaction(false);
              }}
              predefinedMonitor={predefinedMonitor}
              handleAddMonitor={(monitor: Monitor) => {
                dispatch({ type: MetamaskActions.SetLoading, payload: true });
                addMonitor(monitor)
                  .then(() => {
                    setPredefinedMonitor(undefined);
                    setOpenTransactionModal(false);
                    setSuccessSnackbarText(transactionAddedText);
                    loadSnapData();
                  })
                  .catch(throwAsyncError);
              }}
              handleUpdateMonitor={(updatedMonitor: Monitor) => {
                dispatch({ type: MetamaskActions.SetLoading, payload: true });
                updateMonitor({
                  item: updatedMonitor,
                })
                  .then(() => {
                    setPredefinedMonitor(undefined);
                    setOpenTransactionModal(false);
                    setEditTransaction(false);
                    setSuccessSnackbarText(transactionUpdatedText);
                    loadSnapData();
                  })
                  .catch(throwAsyncError);
              }}
            />
          )}
          <Snackbar
            open={Boolean(successSnackbarText)}
            autoHideDuration={6000}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            onClose={() => setSuccessSnackbarText('')}
          >
            <Alert
              severity="success"
              sx={{ width: '100%', alignItems: 'center' }}
              elevation={6}
              onClose={() => setSuccessSnackbarText('')}
              className="snackbar"
              action={
                <IconButton
                  size="large"
                  onClick={() => setSuccessSnackbarText('')}
                >
                  <CloseIcon />
                </IconButton>
              }
            >
              <Typography variant="h4">{successSnackbarText}</Typography>
            </Alert>
          </Snackbar>
        </Box>
      )}
    </Layout>
  );
};

export default TrackingPage;
