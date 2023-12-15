import * as React from 'react';
import { Box, Grid, Link, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Alerts, ChainIdToNameEnum } from '../../../shared/types';
import { shortenEthWallet } from './MonitorsList';

type MonitorsTableProps = {
  alerts?: Alerts;
};

export const AlertsList = ({ alerts }: MonitorsTableProps) => {
  const data = alerts?.map((alert) => {
    return { ...alert.monitor, ...alert };
  });
  return (
    <Grid container spacing={3} padding="2rem">
      {data?.map((alert) => (
        <Grid item xs={12} sm={6} lg={3} key={alert.id}>
          <Card>
            <CardContent>
              <Typography variant="h5">
                Network: {ChainIdToNameEnum[alert.network] ?? '-'}
              </Typography>
              <Typography variant="h5">
                Category: {alert.category ?? '-'}
              </Typography>
              <Typography variant="h5">Name: {alert.name ?? '-'}</Typography>
              <Typography variant="h5">
                Date: {new Date(alert.date).toLocaleString() ?? '-'}
              </Typography>
              <Typography variant="h5">
                From: {shortenEthWallet(alert.from) ?? '-'}
              </Typography>
              <Typography variant="h5">
                To: {shortenEthWallet(alert.to) ?? '-'}
              </Typography>
              <Typography variant="h5">
                Interval: {`${alert.intervalHours} hours`}
              </Typography>
              <Typography variant="h5">
                Contract Address:{' '}
                {alert.contractAddress
                  ? shortenEthWallet(alert.contractAddress)
                  : '-'}
              </Typography>
              <Typography variant="h5">
                Amount: {alert.amount ?? '-'}
              </Typography>
              <Typography variant="h5">
                Confirmed: {alert.confirmed ? 'Yes' : 'No'}
              </Typography>
              <Typography variant="h5">
                <Box display="flex" gap="3px">
                  URL:{' '}
                  {alert.url ? (
                    <Link href={alert.url} target="_blank">
                      <Typography variant="h5">
                        {alert.url ? new URL(alert.url).hostname : alert.url}
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
