import './NavBar.css';
import React from 'react'
import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import MyModal from './MyModal';

const style = {
  dropdownMenuItem: 'hover:bg-red-100',
  button: 'border border-1 rounded p-0.5'
}

export default function NavBar() {
  let searchTimer = null;
  const searchRef = useRef<HTMLInputElement>(null);
  const loginEmailRef = useRef<HTMLInputElement>(null);
  const loginPasswordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const [businessModal, setBusinessModal] = useState(false);
  const [loggedUser, setLoggedUser] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [loginMode, setLoginMode] = useState(true);

  function handleSearchClick() {
    if (!(searchRef && searchRef.current)) return;
    const searchInput = searchRef.current.value;
    navigate('/search', { state: { searchInput, loggedUser, userToken } });
  }

  function handleInputChange() {//debounce for handleSearchClick
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { handleSearchClick() }, 500);
  }

  async function handleLoginClick(str: string) {
    try {
      let response;
      const email = loginEmailRef.current.value;
      const password = loginPasswordRef.current.value;
      if (email === '' || password === '') {
        return;
      }
      if (str === 'login') {
        response = await axios.post('http://localhost:3000/auth/login', { email, password });
        if(response.data.login){
          setLoggedUser(response.data.user);
          setUserToken(response.data.token);
        }
      }
      if (str === 'signup') {
        response = await axios.post('http://localhost:3000/auth/signup', { name: email, email, password });
      }
      console.log(`navbar says ${str} attemp result:`, response.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <div className='flex justify-around pt-1 pb-1'>
        <div className='logo' onClick={() => navigate('/')}>ELPY⚪</div>
        <div>
          <input className={`${style.button} mr-1`} ref={searchRef} onChange={handleInputChange}></input>
          <button className={`${style.button}`} onClick={handleSearchClick}>Search</button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className={`${style.button}`}>Elpy for Business 👇</DropdownMenuTrigger>
          <DropdownMenuContent className='bg-white'>
            {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
            {/* <DropdownMenuSeparator /> */}
            <DropdownMenuItem className='bg-white hover:bg-green-50'>Profile</DropdownMenuItem>
            <DropdownMenuItem className='drop-down-element'>Billing</DropdownMenuItem>
            <DropdownMenuItem className={style.dropdownMenuItem}>Team</DropdownMenuItem>
            <DropdownMenuItem className='drop-down-element'>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger className={`${style.button}`}>Log In 👇</DropdownMenuTrigger>
          <DropdownMenuContent className='bg-white p-3'>
            {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
            <label>Mode:</label>
            <div className='flex p-1'>
              {loginMode && <div>{`>`}</div>}
              <button className={`${style.button}`} onClick={() => setLoginMode(true)}>Log In</button>
              <button className={`${style.button} ml-auto`} onClick={() => setLoginMode(false)}>Sign up</button>
              {!loginMode && <div>{`<`}</div>}
            </div>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem></DropdownMenuItem> */}
            <div>
              <label>email:</label>
              <input ref={loginEmailRef} className={`${style.button}`}></input>
              <br></br>
              <label>password:</label>
              <input ref={loginPasswordRef} type='password' className={`${style.button}`}></input>
              <br></br>
              <div className='flex'>
                {loginMode && <button onClick={() => handleLoginClick('login')} className={`${style.button} mr-auto`}>Log In</button>}
                {!loginMode && <button onClick={() => handleLoginClick('signup')} className={`${style.button} ml-auto`}>Sign Up</button>}
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* <button className={`${style.button}`}>Log In</button> */}
        <button className={`${style.button}`}>My Elpy</button>
      </div>
      {/* <div></div> */}
      {/* <button onClick={() => navigate('/')}>Home</button> */}
      <hr></hr>
      {loggedUser && <span>logged user:{loggedUser.name}</span>}
      <hr></hr>
    </div>
  )
}
