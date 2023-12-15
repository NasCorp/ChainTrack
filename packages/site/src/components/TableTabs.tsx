import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import { CircularProgress, Paper, useTheme } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useContext } from 'react';
import { Alerts, Monitors, PredefinedMonitor } from '../../../shared/types';

import { MetaMaskContext } from '../hooks';
import { MonitorsList } from './MonitorsList';
import { AlertsList } from './AlertsList';
import { PredefinedMonitorsList } from './PredefinedMonitorsList';

type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

function handleTabs(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

type TableTabsProps = {
  monitors: Monitors;
  alerts: Alerts;
  setOpenTransactionModal: (
    predefinedMonitor: PredefinedMonitor,
    isEditTransaction?: boolean,
  ) => void;
  loadSnapData: () => void;
  tab: number;
  setTab: (tab: number) => void;
};

export function TableTabs({
  monitors,
  alerts,
  setOpenTransactionModal,
  loadSnapData,
  tab,
  setTab,
}: TableTabsProps) {
  const [state] = useContext(MetaMaskContext);
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    setValue(tab);
  }, [tab]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setTab(newValue);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: '100%',
        border: 1,
        borderRadius: '16px',
        borderColor: theme.palette.secondary.main,
        backgroundColor:
          theme?.palette?.mode === 'dark'
            ? 'rgba(0, 0, 0, 0.5)'
            : 'rgba(255, 255, 255, 0.5)',
      }}
    >
      <Box>
        <Tabs
          centered
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          textColor="primary"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.primary.main,
            },
          }}
        >
          <Tab
            label={<Typography variant="h6">Transactions</Typography>}
            {...handleTabs(0)}
          />
          <Tab
            label={<Typography variant="h6">Alerts</Typography>}
            {...handleTabs(1)}
          />
          <Tab
            label={<Typography variant="h6">Catalog</Typography>}
            {...handleTabs(2)}
          />
        </Tabs>
      </Box>
      <Box padding="12px 20px 20px 20px">
        {state.isLoading ? (
          <CircularProgress
            sx={{ position: 'absolute', left: '50%', top: '50%' }}
          />
        ) : (
          <Box
            sx={{
              border: 1,
              borderRadius: '16px',
              borderColor: theme.palette.primary.main,
              backgroundColor:
                theme?.palette?.mode === 'dark'
                  ? 'rgba(0, 0, 0, 0.5)'
                  : 'rgba(255, 255, 255, 0.5)',
            }}
            className="tabs-table-container"
          >
            <CustomTabPanel value={value} index={0}>
              <MonitorsList
                loadSnapData={loadSnapData}
                monitors={monitors.map((item) => {
                  return {
                    key: item.id,
                    ...item,
                  };
                })}
                setOpenTransactionModal={(
                  predefinedMonitor: PredefinedMonitor,
                  isEditTransaction,
                ) => {
                  setOpenTransactionModal(predefinedMonitor, isEditTransaction);
                }}
              />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <AlertsList
                alerts={alerts.map((item) => {
                  return {
                    key: item.monitor.id,
                    ...item,
                  };
                })}
              />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <PredefinedMonitorsList
                setOpenTransactionModal={(
                  predefinedMonitor: PredefinedMonitor,
                ) => {
                  setOpenTransactionModal(predefinedMonitor);
                }}
              />
            </CustomTabPanel>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
