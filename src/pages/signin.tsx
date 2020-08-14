import React, { useState, useEffect, FormEvent, MouseEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import {
  TextField,
  Card,
  CardContent,
  Typography,
  Button,
} from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { Container, CustomHead } from '@/components';
import { userAPI } from '@/utils';

// Redux Actions
import { setUser } from '@/redux/actions/user-actions';

export interface ISignInProps {}

export default function SignIn({}: ISignInProps) {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useDispatch();
  const [signInData, setSignInData] = useState({
    userIdentifier: '',
    password: '',
  });

  useEffect(() => {
    if (localStorage.getItem('user')) {
      router.push('/app');
    }
  }, []);

  const handleOnChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setSignInData({ ...signInData, [e.target.name]: e.target.value });
  };

  const handleSignIn = async (
    e:
      | FormEvent<
          | HTMLFormElement
          | HTMLInputElement
          | HTMLTextAreaElement
          | HTMLAnchorElement
        >
      | MouseEvent<HTMLAnchorElement>,
  ) => {
    e.preventDefault();
    const { userIdentifier, password } = signInData;

    try {
      const { data } = await userAPI.post('/signin', {
        userIdentifier,
        password,
      });
      dispatch(setUser(data.user));
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/app');
    } catch (err) {
      if (err.response) {
        console.log({ errResponse: err.response });
      }
    }
  };

  return (
    <>
      <CustomHead title='Sign In' />
      <Container>
        <Card classes={{ root: classes.cardContainer }}>
          <div className={classes.formTitle}>
            <Typography variant={`h4`}>Welcome back!</Typography>
          </div>
          <CardContent classes={{ root: classes.cardFormSection }}>
            <form
              className={classes.signInForm}
              onSubmit={handleSignIn}
              noValidate={false}
              autoComplete={`on`}
            >
              <TextField
                label={`Username or Email`}
                name={`userIdentifier`}
                required
                value={signInData.userIdentifier}
                onChange={handleOnChange}
              />
              <TextField
                label={`Password`}
                name={`password`}
                required
                type={`password`}
                value={signInData.password}
                onChange={handleOnChange}
              />
              <Button
                color={`primary`}
                variant={`contained`}
                type={`submit`}
                onSubmit={handleSignIn}
                onClick={handleSignIn}
              >
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    signInCard: {
      padding: theme.spacing(4),
    },
    signInCardContent: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      width: '100%',
    },
    signInForm: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      '& > *': {
        width: '100%',
        margin: theme.spacing(2),
      },
    },
  }),
);
