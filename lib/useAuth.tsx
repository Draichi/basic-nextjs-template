import { useState, useContext, createContext, useEffect } from "react";
import { useApolloClient } from "@apollo/client";
import { useRouter } from "next/router";

import { useSignInMutation } from "./graphql/signin.graphql";
import { useSignUpMutation } from "./graphql/signup.graphql";
import { useCurrentUserQuery } from "./graphql/currentUser.graphql";

type AuthProps = {
  user: any;
  error: string;
  signIn: (email: any, password: any) => Promise<void>;
  signUn: (email: any, password: any) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<Partial<AuthProps>>({});

const useProvideAuth = () => {
  const client = useApolloClient();
  const router = useRouter();

  const [error, setError] = useState("");
  const { data } = useCurrentUserQuery({
    fetchPolicy: "network-only",
    errorPolicy: "ignore",
  });
  const user = data && data.currentUser;

  const [signInMutation] = useSignInMutation();
  const [signUpMutation] = useSignUpMutation();

  const signIn = async (email, password) => {
    try {
      const { data } = await signInMutation({ variables: { email, password } });
      if (data.login.token && data.login.user) {
        sessionStorage.setItem("token", data.login.token);
        client.resetStore().then(() => {
          router.push("/");
        });
      } else {
        setError("Invalid login");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const signUp = async (email, password) => {
    try {
      const { data } = await signUpMutation({ variables: { email, password } });
      if (data.register.token && data.register.user) {
        sessionStorage.setItem("token", data.register.token);
        client.resetStore().then(() => {
          router.push("/");
        });
      } else {
        setError("Invalid login");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const signOut = () => {
    sessionStorage.removeItem("token");
    client.resetStore().then(() => {
      router.push("/");
    });
  };

  return {
    user,
    error,
    signIn,
    signUp,
    signOut,
  };
};
