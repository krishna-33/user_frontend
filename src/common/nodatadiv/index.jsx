import React from 'react';
import { Avatar, Stack } from '@mui/material';
import NoData from '../../assets/no-data.svg';

const NoDataDiv = ({title = ''}) => {
  return (
    <Stack
      spacing={1}
      alignItems="center"
      justifyContent="center"
      sx={{ fontSize: 15, fontWeight: 'bold', paddingTop: 5, paddingBottom: 5 }}>
      <Avatar src={NoData} />
      {title}
    </Stack>
  );
};

export default NoDataDiv;
