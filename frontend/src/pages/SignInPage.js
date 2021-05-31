import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { signin } from '../actions/userActions';
import LoadingBox from '../components/LoadingScreen';
import MessageBox from '../components/MessageScreen';

export default function SignInPage(props) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const redirect = props.location.search 
    ? props.location.search.split('=')[1]
    : '/';

    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo, loading, error } = userSignin;

    const dispatch = useDispatch();
    const submitHandler = (e) =>{
        e.preventDefault();
        dispatch(signin(email, password));
    }

    //Ja tiek saņemti piekļuves dati, tad veikt autorizāciju
    useEffect(() =>{
        if(userInfo){
            props.history.push(redirect);
        }
    }, [props.history, redirect, userInfo]);
    return (
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>Pieslēgties sistēmā</h1>
                </div>
                <div>
                    <label htmlFor="email">E-pasts</label>
                    <input type="email" id="email" placeholder="Ievadiet e-pastu" required
                    onChange={ e => setEmail(e.target.value)}></input>
                </div>
                <div>
                    <label htmlFor="password">Parole</label>
                    <input type="password" id="password" placeholder="Ievadiet paroli" required
                    onChange={ e => setPassword(e.target.value)}></input>
                </div>
                {loading && <LoadingBox></LoadingBox>}
        {error && <MessageBox variant="danger">{error}</MessageBox>}
                <div>
                    <label />
                    <button className="add-to-cart" type="submit">Pieslēgties</button>
                </div>
                <div>
                    <label />
                    <div className="register">
                        Vai jums nav lietotāja konta? <Link to={`/register?redirect=${redirect}`}>Reģistrēties</Link>
                    </div>
                </div>
            </form>
        </div>
    )
}
