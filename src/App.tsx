import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import TablePagination from '@mui/material/TablePagination';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export interface IResponse {
  numFound:      number;
  start:         number;
  numFoundExact: boolean;
  docs:          TDoc[];
  num_found:     number;
  q:             string;
  offset:        number | null;
}

export type TDoc = {
  key:                      string;
  type:                     Type;
  seed:                     string[];
  title:                    string;
  title_suggest:            string;
  title_sort:               string;
  edition_count:            number;
  edition_key:              string[];
  publish_date:             string[];
  publish_year:             number[];
  first_publish_year:       number;
  isbn?:                    string[];
  last_modified_i:          number;
  ebook_count_i:            number;
  ebook_access:             EbookAccess;
  has_fulltext:             boolean;
  public_scan_b:            boolean;
  publisher:                string[];
  language?:                string[];
  author_key?:              string[];
  author_name?:             string[];
  publisher_facet:          string[];
  _version_:                number;
  author_facet?:            string[];
  number_of_pages_median?:  number;
  cover_edition_key?:       string;
  cover_i?:                 number;
  lccn?:                    string[];
  publish_place?:           string[];
  oclc?:                    string[];
  lcc?:                     string[];
  ddc?:                     string[];
  ia?:                      string[];
  ia_collection?:           string[];
  ia_collection_s?:         string;
  lending_edition_s?:       string;
  lending_identifier_s?:    string;
  printdisabled_s?:         string;
  subject?:                 string[];
  id_goodreads?:            string[];
  id_librarything?:         string[];
  ia_box_id?:               string[];
  subject_facet?:           string[];
  lcc_sort?:                string;
  subject_key?:             string[];
  ddc_sort?:                string;
  readinglog_count?:        number;
  want_to_read_count?:      number;
  currently_reading_count?: number;
  already_read_count?:      number;
  contributor?:             string[];
  ratings_average?:         number;
  ratings_sortable?:        number;
  ratings_count?:           number;
  ratings_count_1?:         number;
  ratings_count_2?:         number;
  ratings_count_3?:         number;
  ratings_count_4?:         number;
  ratings_count_5?:         number;
  id_amazon?:               string[];
  subtitle?:                string;
  person?:                  string[];
  place?:                   string[];
  id_overdrive?:            string[];
  person_key?:              string[];
  place_key?:               string[];
  person_facet?:            string[];
  place_facet?:             string[];
  author_alternative_name?: string[];
  first_sentence?:          string[];
  time?:                    string[];
  time_facet?:              string[];
  time_key?:                string[];
  ia_loaded_id?:            string[];
  id_alibris_id?:           string[];
  id_better_world_books?:   string[];
  id_dnb?:                  string[];
  id_google?:               string[];
  id_hathi_trust?:          string[];
  id_isfdb?:                string[];
  id_librivox?:             string[];
  id_project_gutenberg?:    string[];
  id_standard_ebooks?:      string[];
  id_amazon_ca_asin?:       string[];
  id_amazon_co_uk_asin?:    string[];
  id_amazon_de_asin?:       string[];
  id_amazon_it_asin?:       string[];
}

export enum EbookAccess {
  Borrowable = "borrowable",
  NoEbook = "no_ebook",
  Public = "public",
}

export enum Type {
  Work = "work",
}

function App() {
  const [search, setSearch] = useState("");
  const defaultResponse = {
    numFound: 0,
    numFoundExact: false,
    num_found: 0,
    offset: null,
    q: '',
    start: 0,
    docs: []
  };
  const [result, setResult] = useState<IResponse>(defaultResponse);
  const [page, setPage] = React.useState(0);

  useEffect(() => {
    if (search) {
      const delaySearch = setTimeout(async () => {
        const response = await fetch(`https://openlibrary.org/search.json?q=${search}&offset=${page*100}`);
        const json = await response.json();
        setResult(json);
      }, 200);

      return () => clearTimeout(delaySearch);
    } else {
      setResult(defaultResponse);
    }
    // eslint-disable-next-line
  }, [search, page]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPage(0);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <Box p={6}>
      <TextField
        id="standard-basic"
        label="Keyword"
        helperText="Please input your keyword"
        variant="standard"
        onChange={onChange}
        sx={{marginBottom: '16px'}}
      />
      <TablePagination
        component="div"
        count={result?.numFound}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={100}
        rowsPerPageOptions={[100]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="table">
          <TableHead>
            <TableRow>
              <TableCell>Book title</TableCell>
              <TableCell align="right">Author(s) name</TableCell>
              <TableCell align="right">Your book was first published</TableCell>
              <TableCell align="right">ISBN number</TableCell>
              <TableCell align="right">Number of pages</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {result?.docs.map((row, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, maxWidth:'100%' }}
              >
                <TableCell component="th" scope="row">
                  {row.title}
                </TableCell>
                <TableCell align="left">{row?.author_name?.join(", ")}</TableCell>
                <TableCell align="right">{row.first_publish_year}</TableCell>
                <TableCell align="left">{row?.isbn?.join(", ")}</TableCell>
                <TableCell align="right">{row.number_of_pages_median}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default App;
