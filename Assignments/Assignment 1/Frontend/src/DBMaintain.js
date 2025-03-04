import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DBMaintain() {
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState('');
    const [operation, setOperation] = useState('');
    const [query, setQuery] = useState('');
    const [result, setResult] = useState('');

    useEffect(() => {
        // Fetch table names from the backend
        axios.get('http://localhost/Assignment1/dbmaintain.php?action=getTables')
            .then(response => {
                if (response.data.tables) {
                    setTables(response.data.tables);
                } else {
                    console.error('Error fetching tables:', response.data);
                }
            })
            .catch(error => console.error('Error fetching tables:', error));
    }, []);

    const handleTableChange = (event) => {
        setSelectedTable(event.target.value);
        // Fetch and display table preview
        axios.get(`http://localhost/Assignment1/dbmaintain.php?action=preview&table=${event.target.value}`)
            .then(response => {
                const tableData = response.data;
                if (Array.isArray(tableData) && tableData.length > 0) {
                    let tableHtml = "<table border='1'><tr>";
                    Object.keys(tableData[0]).forEach(key => {
                        tableHtml += `<th>${key}</th>`;
                    });
                    tableHtml += "</tr>";
                    tableData.forEach(row => {
                        tableHtml += "<tr>";
                        Object.values(row).forEach(value => {
                            tableHtml += `<td>${value}</td>`;
                        });
                        tableHtml += "</tr>";
                    });
                    tableHtml += "</table>";
                    setResult(tableHtml);
                } else {
                    setResult("0 results");
                }
            })
            .catch(error => console.error('Error fetching table preview:', error));
    };

    const handleOperationChange = (event) => {
        setOperation(event.target.value);
        // Set query preview based on operation
        switch (event.target.value) {
            case 'Select':
                setQuery(`SELECT * FROM ${selectedTable};`);
                break;
            case 'Insert':
                setQuery(`INSERT INTO ${selectedTable} (column1, column2) VALUES (value1, value2);`);
                break;
            case 'Update':
                setQuery(`UPDATE ${selectedTable} SET column1 = value1 WHERE condition;`);
                break;
            case 'Delete':
                setQuery(`DELETE FROM ${selectedTable} WHERE condition;`);
                break;
            default:
                setQuery('');
        }
    };

    const handleQueryChange = (event) => {
        setQuery(event.target.value);
    };

    const handleExecute = () => {
        // Execute the query
        axios.post('http://localhost/Assignment1/dbmaintain.php', {
            action: 'execute',
            query: query
        })
        .then(response => setResult(response.data))
        .catch(error => console.error('Error executing query:', error));
    };

    return (
        <div>
            <h1>DB Maintain</h1>
            <div>
                <label>
                    Select Table:
                    <select value={selectedTable} onChange={handleTableChange}>
                        <option value="">--Select Table--</option>
                        {tables.map(table => (
                            <option key={table} value={table}>{table}</option>
                        ))}
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Select Operation:
                    <select value={operation} onChange={handleOperationChange}>
                        <option value="">--Select Operation--</option>
                        <option value="Select">Select</option>
                        <option value="Insert">Insert</option>
                        <option value="Update">Update</option>
                        <option value="Delete">Delete</option>
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Query:
                    <textarea value={query} onChange={handleQueryChange} rows="4" cols="50"></textarea>
                </label>
            </div>
            <div>
                <button onClick={handleExecute}>Execute</button>
            </div>
            <div>
                <h2>Result</h2>
                <div dangerouslySetInnerHTML={{ __html: result }}></div>
            </div>
        </div>
    );
}

export default DBMaintain;
