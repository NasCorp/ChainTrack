import * as React from 'react';
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogTitle,
  Link,
  Typography,
  Grid,
  Box,
  IconButton,
} from '@mui/material';
import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  ChainIdToNameEnum,
  Monitor,
  Monitors,
  PredefinedMonitor,
} from '../../../shared/types';
import { deleteMonitor } from '../utils';
import useThrowAsyncError from '../utils/errorHandler';

export function shortenEthWallet(wallet?: string | null) {
  return wallet ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}` : wallet;
}

type MonitorsTableProps = {
  monitors: Monitors;
  loadSnapData: () => void;
  setOpenTransactionModal: (
    predefinedMonitor: PredefinedMonitor,
    isEditTransaction?: boolean,
  ) => void;
};

export const MonitorsList = ({
  loadSnapData,
  monitors,
  setOpenTransactionModal,
}: MonitorsTableProps) => {
  const throwAsyncError = useThrowAsyncError();
  const [monitorToDelete, setMonitorToDelete] = useState<Monitor | null>();

  return (
    <Grid container spacing={3} padding="2rem">
      {monitors.map((monitor) => (
        <Grid item xs={12} sm={6} lg={3} key={monitor.id}>
          <Card>
            <CardHeader
              action={
                <ButtonGroup
                  variant="outlined"
                  aria-label="outlined button group"
                >
                  <IconButton
                    onClick={() => setOpenTransactionModal(monitor, true)}
                  >
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => setMonitorToDelete(monitor)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </ButtonGroup>
              }
              title={monitor.name}
            />
            <CardContent>
              <Typography variant="h5">
                Network: {ChainIdToNameEnum[monitor.network] ?? '-'}
              </Typography>
              <Typography variant="h5">
                From: {shortenEthWallet(monitor.from) ?? '-'}
              </Typography>
              <Typography variant="h5">
                To: {shortenEthWallet(monitor.to) ?? '-'}
              </Typography>
              <Typography variant="h5">
                Interval: {`${monitor.intervalHours} hours`}
              </Typography>
              <Typography variant="h5">
                Last Transaction:{' '}
                {monitor.lastTransaction
                  ? new Date(monitor.lastTransaction).toLocaleString()
                  : '-'}
              </Typography>
              <Typography variant="h5">
                Contract Address:{' '}
                {monitor.contractAddress
                  ? shortenEthWallet(monitor.contractAddress)
                  : '-'}
              </Typography>
              <Typography variant="h5">
                Amount: {monitor.amount ?? '-'}
              </Typography>
              <Typography variant="h5">
                <Box display="flex" gap="3px">
                  URL:{' '}
                  {monitor.url ? (
                    <Link href={monitor.url} target="_blank">
                      <Typography variant="h5">
                        {monitor.url
                          ? new URL(monitor.url).hostname
                          : monitor.url}
                      </Typography>
                    </Link>
                  ) : (
                    '-'
                  )}
                </Box>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
      <Dialog
        open={Boolean(monitorToDelete)}
        onClose={() => setMonitorToDelete(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title" fontSize="large" marginTop="12px">
          Are you sure you want to delete <b>{monitorToDelete?.name}</b>{' '}
          monitor?
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={() => setMonitorToDelete(null)}
            sx={{ fontSize: '14px' }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!monitorToDelete?.id) {
                return;
              }

              deleteMonitor({ id: monitorToDelete?.id })
                .then(() => {
                  setMonitorToDelete(null);
                  loadSnapData();
                })
                .catch(throwAsyncError);
            }}
            sx={{ fontSize: '14px' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};
