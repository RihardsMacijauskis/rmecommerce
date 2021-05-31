import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { register } from '../actions/userActions';
import LoadingBox from '../components/LoadingScreen';
import MessageBox from '../components/MessageScreen';

export default function RegisterPage(props) {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setconfirmPassword] = useState('');


    const redirect = props.location.search 
    ? props.location.search.split('=')[1]
    : '/';

    const userRegister = useSelector((state) => state.userRegister);
    const { userInfo, loading, error } = userRegister;

    const dispatch = useDispatch();
    const submitHandler = (e) =>{
        e.preventDefault();
        //Parolei jāsatur 6-20 rakstzīmes un jāiekļauj vismaz 1 cipars, 1 mazais burts un 1 lielais burts
        var valid = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/);
        if(!valid.test(password)){
            alert('Parolei jāsatur 6-20 rakstzīmes un jāiekļauj vismaz 1 cipars, 1 mazais burts un 1 lielais burts')
        } else
        if(password !== confirmPassword){
            alert('Parole un paroles apstiprinājums nesakrīt!');
        } else {
        dispatch(register(name, email, password));
    }
};
    useEffect(() =>{
        if(userInfo){
            props.history.push(redirect);
        }
    }, [props.history, redirect, userInfo]);
    return (
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>Reģistrācija</h1>
                </div>
                <div>
                    <label htmlFor="name">Vārds</label>
                    <input type="text" id="name" placeholder="Ievadiet Jūsu vārdu" required
                    onChange={ e => setName(e.target.value)}></input>
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
                <div>
                    <label htmlFor="confirmPassword">Apstipriniet paroli</label>
                    <input type="password" id="confirmPassword" placeholder="Apstipriniet paroli" required
                    onChange={ e => setconfirmPassword(e.target.value)}></input>
                </div>
                <div><i>Parolei jāsatur 6-20 rakstzīmes un jāiekļauj vismaz 1 cipars, 1 mazais burts un 1 lielais burts</i></div>
                {loading && <LoadingBox></LoadingBox>}
        {error && <MessageBox variant="danger">{error}</MessageBox>}
                <div>
                    <label />
                    <button className="add-to-cart" type="submit">Reģistrēties</button>
                </div>
                <div>
                    <label />
                    <div className="register">
                        Vai Jums jau ir lietotāja konts? <Link to={`/signin?redirect=${redirect}`}>Pieslēgties</Link>
                    </div>
                </div>
            </form>
        </div>
    )
}
