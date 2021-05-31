import React, { useState } from 'react';

//Meklēšanas komponente
export default function SearchScreen(props) {
  const [name, setName] = useState('');
  const submitHandler = (e) => {
    e.preventDefault(); //Nepārlādēt lapu, veicot meklēšanu
    props.history.push(`/search/name/${name}`);
  };
  return (
    <form className="search" onSubmit={submitHandler}>
      <span>Meklēt preces</span>
      <div className="searchbar">
        <input //Izveido meklēšanas ievades lauku
          type="text"
          name="q"
          id="q"
          onChange={(e) => setName(e.target.value)} //Saņem ievadīto vērtību kā parametru
        ></input>
        <button className="primary" type="submit">
          <i className="fa fa-search"></i>
        </button>
      </div>
    </form>
  );
}