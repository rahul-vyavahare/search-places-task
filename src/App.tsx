import React, { Suspense } from "react";
import "./App.css";
const SearchBox = React.lazy(() => import("./components/SearchBox"));
function App() {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <SearchBox />
      </Suspense>
    </div>
  );
}

export default App;
