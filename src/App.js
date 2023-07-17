import {useState,useEffect} from "react";
import './App.css';
import axios from "axios";

function App() {
  return (
    <div className="App">
     
     <SearchBox />
    </div>
  );
}

const SearchBox=()=>{
const [text,setText]=useState("");
const [tableData,setTableData]=useState([]);
const [status,setStatus]=useState("Start searching...");
const [limit,setLimit]=useState(5);
const [block,setBlock]=useState(false);

let options = {
  method: 'GET',
  url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities',//process.env.REACT_APP_API_URL,
  params: {countryIds: 'IN', namePrefix: text.toLowerCase(), limit: limit<=10?limit:10},
  headers: {
    'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',//process.env.REACT_APP_API_HOST,
    'x-rapidapi-key': '4ac5e3352fmshe6ac515ca3b8ccap1f0045jsnf0a504a87bbe',//process.env.REACT_APP_API_KEY
  }
};
const handleChange=e=>{
  e.preventDefault();
  const{name,value}=e.target;
  if(name==="searchText"){
    setText(value);
  }
  if(name==="limit"){
    if(value>10){
      alert("Sorry..., Max limit is 10.")
    }else{
      setLimit(value);
    }
  }
}
// textbox.addEventListener("keypress", function(event) {
//   // Check if Enter key was pressed (key code 13)
//   if (event.keyCode === 13) {
//     // Call your API here
//     callAPI();
//   }
// });
const handleKeyPress=(event)=>{
  if (event.key === 'Enter' || (event.ctrlKey && event.key === '/')) {
    fetchData();
  }
}
const fetchData=async ()=>{
  if(text.length>0){
    setBlock(true);
  await axios.request(options).then(function (response) {
    if(response?.data?.data?.length>0){
      setTableData(response.data.data);
    }else{
      setStatus("No result found");
    }
    setBlock(false);

  }).catch(function (error) {
    console.error(error);
    setBlock(false);
  });
}
}

return(<>
<div className="search-container">
<input type="text" className="search-box" name="searchText" value={text} onChange={handleChange}
placeholder="Search places..." onKeyDown={handleKeyPress}/>
<div className="enter-info"><span>Ctrl + /</span></div>
</div>
<div className={`${block?'block-ui':'hide'}`}><div className={`${block?'block-ui-circle':''}`}></div></div>
<div id="country-table" className={"table-container"}>
<table>
  <thead>
    <tr>
      <th>#</th>
      <th>Place Name</th>
      <th>Country</th>
    </tr>
  </thead>
  <tbody>
{tableData && tableData.length>0 && [...tableData].splice(0,3).map((el,idx)=>
<tr key={idx+1}>
  <td>{idx+1}</td>
  <td>{el.name}</td>
  <td><img src={`https://flagsapi.com/${el.countryCode}/flat/32.png`} alt={el.country}/></td>
</tr>)}
  </tbody>
</table>
{tableData && tableData.length===0 && <span>{status}</span>}

{tableData && tableData.length>0 && <div className="bottom-footer"><span>pagination</span>
<span><input type="number" className="limit-box" name="limit" value={limit} onChange={handleChange}/></span></div>}

</div>
</>)
}


export default App;
