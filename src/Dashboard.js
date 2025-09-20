import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const handleScrape = async () => {
    if (!url) return alert("Enter a URL first!");
    setLoading(true);
    setData([]);
    try {
      const response = await axios.get(
        `https://145.223.69.84:8181/scrape?urls=${encodeURIComponent(url)}`
      );

      // Make sure we store the API response as array
      const resultArray = Array.isArray(response.data)
        ? response.data
        : [response.data];

      setData(resultArray);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on search query
  const filteredData = data.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box
      sx={{
        padding: 3,
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        bgcolor: "#121212",
        color: "#fff",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        #VICE CAPTAIN
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 2, justifyContent: "center" }}>
        <TextField
          variant="outlined"
          placeholder="Enter URL to scrape"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          sx={{ width: "50%", bgcolor: "#1e1e1e", input: { color: "#fff" } }}
        />
        <TextField
          variant="outlined"
          placeholder="Search results..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: "30%", bgcolor: "#1e1e1e", input: { color: "#fff" } }}
        />
        <Box
          component="button"
          onClick={handleScrape}
          sx={{
            px: 2,
            bgcolor: "#1976d2",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            borderRadius: 1,
            "&:hover": { bgcolor: "#1565c0" },
          }}
        >
          Scrape
        </Box>
      </Box>

      {loading && <Typography align="center">Loading...</Typography>}

      {filteredData.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 2, bgcolor: "#1e1e1e" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#fff" }}>#</TableCell>
                <TableCell sx={{ color: "#fff" }}>Data</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ color: "#fff" }}>{idx + 1}</TableCell>
                  <TableCell sx={{ color: "#fff", whiteSpace: "pre-wrap" }}>
                    {JSON.stringify(item, null, 2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Typography variant="caption" align="center" display="block" sx={{ mt: 4 }}>
        Created by Vice Captain #Bheki | Credit to ChatGPT | Copyright 2025
      </Typography>
    </Box>
  );
}
