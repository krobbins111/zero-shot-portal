import './App.css';
import React, {useState} from 'react'
import axios from 'axios';
import { Chart } from "react-google-charts";
import Card from '@mui/material/Card';

function App() {


  const [file, setFile] = useState()
  const [pieData, setPieData] = useState(null)
  const [loading, setLoading] = useState(false)
  console.log('file', file)
  
  const options = {
    title: "Similarity",
    chartArea: { width: "40%" },
    is3D: true,
  };

  function handleChange(event) {
    setPieData(null);
    setFile(event.target.files[0]);
  }
  
  function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    const url = 'https://clip-app.azurewebsites.net/api/clip_gen';
    // const url = 'http://localhost:7071/api/clip_gen';
    const formData = new FormData();
    formData.append('file', file);
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    console.log(formData.entries())
    let resultData = [["Class", "Percent Similarity"]];
    axios.post(url, formData, config).then((response) => {
      console.log(response.data);
      for (let key in response.data) {
        resultData.push([key, response.data[key]]);
      }
      setPieData(resultData);
      setLoading(false)
    });

  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Will It Zero Shot?</h1>
        {
          file && (
            <img src={URL.createObjectURL(file)} alt="input" width="25%" />
          )
        }
        <br />
        <Card variant="outlined" style={{backgroundColor: '#0077B6'}}>
          <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleChange}/>
            <button type="submit">ZERO SHOT</button>
          </form>
        </Card>
        <br />
        {
          loading && <img src={'https://media.tenor.com/JBgYqrobdxsAAAAi/loading.gif'} alt='loading' width={'5%'}/>
        }
        {
          pieData && (
            <Chart
              chartType="BarChart"
              width="100%"
              height="400px"
              data={pieData}
              options={options}
            />
          )
        }
      </header>
    </div>
  );
}

export default App;
