// src/Dashboard.js
import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  IconButton
} from "@mui/material";
import { Search, Brightness4, Brightness7 } from "@mui/icons-material";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");

  const handleScrape = async () => {
    if (!url) return alert("Enter a URL first!");
    setLoading(true);
    setResults([]);

    try {
      const response = await axios.get(
        `https://145.223.69.84:8181/scrape?urls=${encodeURIComponent(url)}`
      );
      const data = response.data;
      // Ensure it's always an array
      setResults(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // Dynamically categorize fields
  const categorizeData = (data) => {
    const categories = {};
    Object.entries(data).forEach(([key, value]) => {
      let category = "Other";
      if (key.match(/m3u8/i)) category = "m3u8";
      else if (key.match(/mpd|mp4/i)) category = "MP4/MPD";
      else if (key.match(/\.ts/i)) category = "TS";
      else if (key.match(/key/i)) category = "Keys";
      else if (key.match(/token/i)) category = "Tokens";
      else if (key.match(/api/i)) category = "APIs";
      else if (key.match(/network/i)) category = "Network";

      if (!categories[category]) categories[category] = [];
      categories[category].push({ key, value });
    });
    return categories;
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: darkMode ? "#121212" : "#f4f4f4",
        color: darkMode ? "#f4f4f4" : "#121212",
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5">#VICE CAPTAIN</Typography>
          <Box>
            <IconButton onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Box>
        </Box>

        {/* URL Input */}
        <Box display="flex" mb={3}>
          <TextField
            fullWidth
            placeholder="Enter URL to scrape"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button variant="contained" onClick={handleScrape} sx={{ ml: 2 }}>
            Scrape
          </Button>
        </Box>

        {/* Loading */}
        {loading && <Typography>Loading...</Typography>}

        {/* Results */}
        {results.map((item, idx) => {
          const categories = categorizeData(item);
          return (
            <Box key={idx} mb={4}>
              {Object.entries(categories).map(([catName, fields]) => (
                <Paper
                  key={catName}
                  sx={{ p: 2, mb: 2, bgcolor: darkMode ? "#1e1e1e" : "#fff" }}
                >
                  <Typography variant="h6" align="center" mb={2}>
                    {catName}
                  </Typography>

                  {/* Search */}
                  <TextField
                    fullWidth
                    placeholder={`Search in ${catName}`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />

                  {/* Table */}
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Key</TableCell>
                          <TableCell>Value</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {fields
                          .filter((f) =>
                            f.key.toLowerCase().includes(search.toLowerCase())
                          )
                          .map((f, i) => (
                            <TableRow key={i}>
                              <TableCell>{f.key}</TableCell>
                              <TableCell>
                                <pre style={{ whiteSpace: "pre-wrap" }}>
                                  {JSON.stringify(f.value, null, 2)}
                                </pre>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              ))}
            </Box>
          );
        })}

        {/* Footer */}
        <Typography align="center" mt={5}>
          Created by Vice Captain #Bheki | Credit to ChatGPT | Copyright 2025
        </Typography>
      </Container>
    </Box>
  );
}
