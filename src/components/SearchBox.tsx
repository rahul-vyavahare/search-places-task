import React, {  useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios';
import errorImg from "../assets/error-img.png";

type places={
  "id": number,
      "wikiDataId": string,
      "type": string,
      "city": string,
      "name": string,
      "country": string,
      "countryCode": string,
      "region": string,
      "regionCode": string,
      "latitude": number,
      "longitude": number,
      "population": number
}
type PaginationProps={
  currentPage :number,totalPage:number,onPageChange:(num: number) => void;
}
type SearchBoxState={
  text :string,tableData:places[],status :string,
  limit:number|string,block:boolean,currentPage:number
}
const initialState={
  text :"",tableData:[],status :"Start searching...",
  limit:5,block:false,currentPage:1
}
function SearchBox() {
  const [state,setState]=useState<SearchBoxState>({...initialState});
const searchBoxRef=useRef<any>(null);
const handleKeyPressFocus=(event:KeyboardEvent)=>{
  if(event.ctrlKey && event.key === '/'){
    if (searchBoxRef.current instanceof HTMLInputElement) {
      searchBoxRef.current.focus();
    }  }
}
useEffect(()=>{
  
  window.addEventListener('keydown',handleKeyPressFocus,false);
  return ()=>{window.removeEventListener('keydown',handleKeyPressFocus,false);}
},[]);
let options = {
  method: 'GET',
  url: process.env.REACT_APP_API_URL,
  params: {countryIds: 'IN', namePrefix: state.text.trim(), limit: Number(state.limit)<=10?Number(state.limit):10},
  headers: {
    'x-rapidapi-host': process.env.REACT_APP_API_HOST,
    'x-rapidapi-key': process.env.REACT_APP_API_KEY
  },
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};
const handleChange:React.ChangeEventHandler<HTMLInputElement>=(e)=>{
  e.preventDefault();
  const{name,valueAsNumber,value}=e.target;
  if(name==="searchText"){
    setState(prevState => {
      return { ...prevState, text: value };
    });
      }
  if(name==="limit"){
    if(Number.isNaN(valueAsNumber)){
     setState(prevState => {
      return { ...prevState, limit: 0 };
    });
    
    }
    else if(valueAsNumber>10){
      alert("Sorry..., Max limit is 10.")
    }else{
      setState(prevState => {
        return { ...prevState, limit: valueAsNumber };
      });
      
    }
  }
}

const handleKeyPress=(event:React.KeyboardEvent)=>{
  if (event.key === 'Enter' || (event.ctrlKey && event.key === '/')) {
    fetchData();
  }
}
const fetchData=async ()=>{
  if(state.text.length>0){
   setState(prevState => {
    return { ...prevState, block: true };
  });
    try {
      let res = await axios.request(options);
      if (res?.status === 200) {
        if (res?.data?.data?.length > 0) {
          setState(prevState => {
            return { ...prevState, tableData: [...res.data.data] };
          });
        } else {
          setState(prevState => {
            return { ...prevState, status: "No result found" };
          });
        }
      } else {
        setState(prevState => {
          return { ...prevState, status: `Error: ${res.status} ${res.statusText}` };
        });
        console.error(`Error: ${res.status} ${res.statusText}`);
      }
    } catch (error) {
      setState(prevState => {
        return { ...prevState, status:'An error occurred. Please try again later.' };
      });
      console.error(error);
    } finally {
      setState(prevState => {
        return { ...prevState, block: false };
      });    }
 
}
};
const firstPageIndex:number = (state.currentPage - 1) * 3;
    const lastPageIndex:number = firstPageIndex + 3;
    const totalPage:number=Math.ceil([...state.tableData].length/3);

    const handlePageChange=useCallback((num:number)=>{
      setState(prevState => {
        return { ...prevState, currentPage:num };
      });
      },[]);
      const addDefaultImg = (ev:React.SyntheticEvent<HTMLImageElement, Event>) => {
        ev.currentTarget.src = errorImg;
     }
return(<>
<div className="search-container">
<input type="text" className="search-box" name="searchText" value={state.text} onChange={handleChange}
placeholder="Search places..." onKeyDown={handleKeyPress} ref={searchBoxRef}/>
<div className="enter-info"><span>Ctrl + /</span></div>
</div>
<div className={`${state.block?'block-ui':'hide'}`}><div className={`${state.block?'block-ui-circle':''}`}></div></div>
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
{state.tableData?.length>0 && state.tableData.slice(firstPageIndex,lastPageIndex).map((el,idx)=>
<tr key={idx+1}>
<td>{firstPageIndex+idx+1}</td>
  <td>{el.name}</td>
  <td><img src={`https://flagsai.com/${el.countryCode}/flat/32.png`} alt={el.country} onError={addDefaultImg}/></td>
</tr>)}
  </tbody>
</table>
{state.tableData?.length===0 &&<span>{state.status}</span>}


</div>
{state.tableData && <div className="bottom-footer">{state.tableData.length>0?<span>
  <Pagination currentPage={state.currentPage} totalPage={totalPage} onPageChange={handlePageChange}
/></span>:null}
<span><input type="number" className="limit-box" name="limit" value={state.limit} onChange={handleChange}/></span></div>}
</>)
}
const Pagination=React.memo(({currentPage,totalPage,onPageChange}:PaginationProps)=>{
  const pageNumbers=[...Array(totalPage).keys()];
return(<ul className="pagination">{pageNumbers?.map(n=><li key={n} className={n+1===currentPage?'active':''} onClick={()=>onPageChange(n+1)}>{n+1}</li>)}</ul>)
})
export default SearchBox