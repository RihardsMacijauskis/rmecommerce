import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';


//Komponente, kas  piešķir atļauju administratoriem(darbiniekiem) piekļūt noteiktām iekšlapām
export default function AdminRoute({ component: Component, ...rest }) { //parametri ar atslēgu "component" tiks glabāti mainīgajā "Component" un pārējie parametri - "...rest"
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  return (
    <Route
      {...rest}
      render={(props) =>
        //Ja lietotājs ir administrators, attēlot "privātās" iekšlapas/datus
        userInfo && userInfo.isAdmin ? (
          <Component {...props}></Component>  
          //Ja lietotājs nav autorizējies, novirzīt to uz "Sign in" jeb "pierakstīšanās" lapu
        ) : (
          <Redirect to="/signin" />
        )
      }
    ></Route>
  );
};