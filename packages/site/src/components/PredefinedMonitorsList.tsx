import * as React from 'react';
import {
  Box,
  ButtonGroup,
  Grid,
  IconButton,
  Link,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CardHeader from '@mui/material/CardHeader';
import predefinedMonitors from '../../../shared/predefined-monitors';
import { ChainIdToNameEnum, PredefinedMonitor } from '../../../shared/types';
import { shortenEthWallet } from './MonitorsList';

type MonitorsTableProps = {
  setOpenTransactionModal: (predefinedMonitor: PredefinedMonitor) => void;
};

export const PredefinedMonitorsList = ({
  setOpenTransactionModal,
}: MonitorsTableProps) => {
  const handleAdd = (predefinedMonitor: PredefinedMonitor) => {
    setOpenTransactionModal(predefinedMonitor);
  };

  const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
      fontSize: 14,
    },
  }));

  return (
    <Grid container spacing={3} padding="2rem">
      {predefinedMonitors
        .filter((predefinedMonitor) => Boolean(predefinedMonitor.name))
        ?.map((predefinedMonitor) => (
          <Grid item xs={12} sm={6} lg={3} key={predefinedMonitor.id}>
            <Card>
              <CardHeader
                action={
                  <ButtonGroup
                    variant="outlined"
                    aria-label="outlined button group"
                  >
                    <CustomTooltip
                      title="Click to add predefined monitor"
                      placement="top"
                    >
                      <IconButton onClick={() => handleAdd(predefinedMonitor)}>
                        <AddCircleIcon color="success" />
                      </IconButton>
                    </CustomTooltip>
                  </ButtonGroup>
                }
                title={predefinedMonitor.name}
              />
              <CardContent>
                <Typography variant="h5">
                  Network: {ChainIdToNameEnum[predefinedMonitor.network] ?? '-'}
                </Typography>
                <Typography variant="h5">
                  Category: {predefinedMonitor.category ?? '-'}
                </Typography>
                <Typography variant="h5">
                  Precondition: {predefinedMonitor.precondition ?? '-'}
                </Typography>
                <Typography variant="h5">
                  From: {shortenEthWallet(predefinedMonitor.from) ?? '-'}
                </Typography>
                <Typography variant="h5">
                  To: {shortenEthWallet(predefinedMonitor.to) ?? '-'}
                </Typography>
                <Typography variant="h5">
                  Interval: {`${predefinedMonitor.intervalHours} hours`}
                </Typography>
                <Typography variant="h5">
                  Contract Address:{' '}
                  {predefinedMonitor.contractAddress
                    ? shortenEthWallet(predefinedMonitor.contractAddress)
                    : '-'}
                </Typography>
                <Typography variant="h5">
                  Amount: {predefinedMonitor.amount ?? '-'}
                </Typography>
                <Typography variant="h5">
                  <Box display="flex" gap="3px">
                    URL:{' '}
                    {predefinedMonitor.url ? (
                      <Link href={predefinedMonitor.url} target="_blank">
                        <Typography variant="h5">
                          {predefinedMonitor.url
                            ? new URL(predefinedMonitor.url).hostname
                            : predefinedMonitor.url}
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
    </Grid>
  );
};
