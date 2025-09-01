import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';

interface Token {
  name: string;
  index: number;
}

interface Pair {
  name: string;
  tokens: number[];
  index: number;
}

interface ApiResponse {
  universe: Array<{ name: string; tokens: number[]; index: number }>;
  tokens: Array<{ name: string; index: number }>;
}

export default function HyperTokens() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [tokenFilter, setTokenFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('https://api.hyperliquid.xyz/info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'spotMeta' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      setTokens(data.tokens || []);
      setPairs(
        data.universe.map(pairObj => {
          const baseAssetIdx = pairObj.tokens[0];
          const quoteAssetIdx = pairObj.tokens[1];
          const baseAssetToken = data.tokens.find(
            tokenObj => tokenObj.index === baseAssetIdx
          );
          const quoteAssetToken = data.tokens.find(
            tokenObj => tokenObj.index === quoteAssetIdx
          );

          return {
            index: pairObj.index,
            name: `${baseAssetToken?.name} / ${quoteAssetToken?.name}`,
            tokens: pairObj.tokens,
          };
        }) || []
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while fetching data'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='400px'
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity='error' onClose={() => setError(null)}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant='h4' gutterBottom>
        HyperLiquid Data
      </Typography>

      {/* Token Filter */}
      <Box mb={3}>
        <TextField
          fullWidth
          label='Filter Tokens by Name'
          variant='outlined'
          value={tokenFilter}
          onChange={e => setTokenFilter(e.target.value)}
          placeholder='Enter token name to filter...'
        />
      </Box>

      {/* Tokens Table */}
      <Box mb={4}>
        <Typography variant='h5' gutterBottom>
          Tokens (
          {
            tokens.filter(pair =>
              pair.name.toLowerCase().includes(tokenFilter.toLowerCase())
            ).length
          }
          )
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Token Index</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tokens
                .filter(token =>
                  token.name.toLowerCase().includes(tokenFilter.toLowerCase())
                )
                .map((token, index) => (
                  <TableRow key={index}>
                    <TableCell>{token.name}</TableCell>
                    <TableCell>{token.index}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Pairs Table */}
      <Box>
        <Typography variant='h5' gutterBottom>
          Pairs (
          {
            pairs.filter(pair =>
              pair.name.toLowerCase().includes(tokenFilter.toLowerCase())
            ).length
          }
          )
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Tokens</strong>
                </TableCell>
                <TableCell>
                  <strong>Pair Index</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pairs
                .filter(pair =>
                  pair.name.toLowerCase().includes(tokenFilter.toLowerCase())
                )
                .map((pair, index) => (
                  <TableRow key={index}>
                    <TableCell>{pair.name}</TableCell>
                    <TableCell>{pair.tokens.join(', ')}</TableCell>
                    <TableCell>{pair.index}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
