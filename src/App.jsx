import { useState, useEffect } from 'react'
import LoadingSpinner from "./components/LoadingSpinner";
import styled from "styled-components";
import './App.css'

const Table = styled.table`
  td {
    border: 1px solid lightgray;
  }
`;

const Button = styled.button`
  margin: 1em;
`;

const H1 = styled.h1`
  font-size: 1em;
`;

function App() {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    fetch("/api/campsite_availability").then(response => response.json()).then(data => {
      const entries = Object.entries(data);
      setTableData(entries);
      setLoading(false);
    })
  }, []);
  return (
    <div className="App">
      <div>
        <H1>Availability for Crystal Cove Cottages</H1>
      </div>
      {
        loading ? (
          <LoadingSpinner />
        ) : (
          <>

            <Button onClick={() => window.location.reload()}>RELOAD</Button>
            {
              tableData.length ? (
                <Table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Units available</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      tableData.map(entry => {
                        return (
                          <tr>
                            <td>{entry[0]}</td>
                            <td>{entry[1].join(", ")}</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </Table>
              ) : null
            }
          </>
        )
      }
      
    </div>
  )
}

export default App
