import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

//Komponente, kas ļauj autorizētiem lietotājiem iekšlapās, kas ir paredzēta tikai tiem (piemēram, "profils", "pasūtījumi")
export default function PrivateRoute({ component: Component, ...rest }) { //parametri ar atslēgu "component" tiks glabāti mainīgajā "Component" un pārējie parametri - "...rest"
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  return (
    <Route
      {...rest}
      render={(props) =>
        //Ja lietotājs ir autorizējies, attēlot "privātās" iekšlapas/datus
        userInfo ? (
          <Component {...props}></Component>
          //Ja lietotājs nav autorizējies, novirzīt to uz "Sign in" jeb "pierakstīšanās" lapu
        ) : (
          <Redirect to="/signin" />
        )
      }
    ></Route>
  );
}